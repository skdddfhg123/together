import React, { useState, useEffect, useCallback } from 'react';
import { UUID } from 'crypto';
import { isSameDay, startOfMonth, endOfMonth, addDays, format } from 'date-fns';

import { AllEvent } from '@type/index';
import {
  useSelectedDayStore,
  useSelectedCalendarStore,
  useSocialEventListStore,
  useGroupEventListStore,
  useAllEventListStore,
} from '@store/index';
import * as CALENDAR from '@services/calendarAPI';

import EventModal from '@components/Canlendar/EventModal';
import EventDetails from '@components/Canlendar/EventDetails/EventDetails';
import GroupMemberEvent from '@components/Canlendar/GroupMemberEvent';
import '@styles/calendar.css';

type CalendarProps = {
  isPrevMonth: boolean;
  isNextMonth: boolean;
  currentMonth: Date;
};

// TODO 일정 그릴 때, 그룹 캘린더 별로 구분할 수 있도록 색 지정해서 그릴 필요 있음.
export default React.memo(function CalendarPage({
  isPrevMonth,
  isNextMonth,
  currentMonth,
}: CalendarProps) {
  const { selectedDay, setSelectedDay } = useSelectedDayStore();

  const { selectedCalendar } = useSelectedCalendarStore();
  const { socialEventList } = useSocialEventListStore();
  const { AllEventList } = useAllEventListStore();
  const { groupEventList } = useGroupEventListStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // *****************? 특정 일자 이벤트 등록 Modal
  const [eventModalOn, setEventModalOn] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // *****************? 등록된 그룹 이벤트의 세부 slide-bar
  const [detailsOn, setDetailsOn] = useState<boolean>(false);
  const [groupEventId, setGroupEventId] = useState<UUID | null>(null);

  // *****************? 더블 클릭으로 이벤트 등록 Modal 띄움
  const handleDayClick = (day: Date, e: React.MouseEvent<HTMLTableCellElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ x: rect.left, y: rect.top });

    if (selectedDay && isSameDay(day, selectedDay)) {
      setEventModalOn(!eventModalOn);
    } else {
      setSelectedDay(day);
      setEventModalOn(false);
    }
  };

  const handleDetails = useCallback((eventId: UUID, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!groupEventId || eventId !== groupEventId) {
      setGroupEventId(eventId);
      setDetailsOn(true);
    } else {
      detailsClose();
      setGroupEventId(null);
    }
  }, []);

  // *****************? 자식컴포넌트 전달을 위한 callback 최적화
  const eventModalClose = useCallback(() => {
    setEventModalOn(false);
  }, []);

  const detailsClose = useCallback(() => {
    setDetailsOn(false);
  }, []);

  // *****************? 달력 생성 Logic
  const buildCalendarDays = useCallback(() => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);

    const days: Date[] = [];
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day = addDays(day, 1)) {
      days.push(day);
    }

    const startWeekday = firstDayOfMonth.getDay();
    const endWeekday = lastDayOfMonth.getDay();
    for (let i = 0; i < startWeekday; i++) {
      days.unshift(addDays(firstDayOfMonth, -i - 1));
    }
    for (let i = 0; i < 6 - endWeekday; i++) {
      days.push(addDays(lastDayOfMonth, i + 1));
    }

    return days;
  }, []);

  // *****************? 세부 일정 및 이벤트 생성 Logic
  const buildCalendarTag = (calendarDays: Date[]) => {
    const eventMap = new Map<string, JSX.Element[]>();

    // ************* 소셜 이벤트 생성
    socialEventList.forEach((event: AllEvent) => {
      const eventDate = format(new Date(event.startAt), 'yyyy-MM-dd');
      const existingEvents = eventMap.get(eventDate) || [];
      existingEvents.push(
        <li
          className={`${
            event.social === 'kakao'
              ? 'kakao-event'
              : event.social === 'google'
                ? 'google-event'
                : event.social === 'discord'
                  ? 'discord-event'
                  : 'outlook-event'
          }`}
          key={existingEvents.length}
        >
          {event.social}
        </li>,
      );
      eventMap.set(eventDate, existingEvents);
    });

    // ************* 그룹 이벤트 생성 or All 이벤트 생성
    if (selectedCalendar === 'All') {
      AllEventList.forEach((event) => {
        const eventDate = format(new Date(event.startAt), 'yyyy-MM-dd');
        const existingEvents = eventMap.get(eventDate) || [];
        existingEvents.push(
          <li
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
            onClick={(e) => event.id && handleDetails(event.id, e)}
            className="group-event"
            style={{ backgroundColor: `${event.type}` }}
            key={event.id}
          >
            {event.title || 'No Title'}
          </li>,
        );
        eventMap.set(eventDate, existingEvents);
      });
    } else {
      groupEventList.forEach((event) => {
        const eventDate = format(new Date(event.startAt), 'yyyy-MM-dd');
        const existingEvents = eventMap.get(eventDate) || [];
        existingEvents.push(
          <li
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
            onClick={(e) => event.groupEventId && handleDetails(event.groupEventId, e)}
            className="group-event"
            style={{ backgroundColor: `${event.color}` }}
            key={event.groupEventId}
          >
            {event.title || 'No Title'}
          </li>,
        );
        eventMap.set(eventDate, existingEvents);
      });
    }
    /*
     * ********** 멤버 이벤트 생성
     */

    return calendarDays.map((day: Date, i: number) => {
      const localDayKey = format(day, 'yyyy-MM-dd');
      const eventElements = eventMap.get(localDayKey) || [];

      if (day.getMonth() < currentMonth.getMonth()) {
        return (
          <td key={i} className="prevMonthDay">
            <div>{isPrevMonth ? day.getDate() : ''}</div>
            <ul className="SCROLL-hide" id="event-box">
              {eventElements}
            </ul>
          </td>
        );
      }
      if (day.getMonth() > currentMonth.getMonth()) {
        return (
          <td key={i} className="nextMonthDay">
            <div>{isNextMonth ? day.getDate() : ''}</div>
            <ul className="SCROLL-hide" id="event-box">
              {eventElements}
            </ul>
          </td>
        );
      }

      const dayOfWeek = day.getDay();
      const isToday = isSameDay(day, today);
      let dayClasses = `Day day-${dayOfWeek}`;
      if (isToday) dayClasses += ' today';
      if (selectedDay && isSameDay(day, selectedDay)) dayClasses += ' choiceDay';

      return (
        <td key={i} className={`${dayClasses}`} onClick={(e) => handleDayClick(day, e)}>
          <div className="dayBox">
            <span className="day">{day.getDate()}</span>
            <span className="GroupMember-Box">
              <GroupMemberEvent selectedCalendar={selectedCalendar} localDayKey={localDayKey} />
            </span>
          </div>
          <ul className="SCROLL-hide" id="event-box">
            {eventElements}
          </ul>
        </td>
      );
    });
  };

  const divideWeek = (calendarTags: JSX.Element[]) => {
    return calendarTags.reduce((acc: JSX.Element[][], day: JSX.Element, i: number) => {
      if (i % 7 === 0) acc.push([day]);
      else acc[acc.length - 1].push(day);
      return acc;
    }, []);
  };

  const calendarDays = buildCalendarDays();
  const calendarTags = buildCalendarTag(calendarDays);
  const calendarRows = divideWeek(calendarTags);

  // *****************? 최초 달력 일정 Rendering
  useEffect(() => {
    if (!selectedCalendar) return;

    if (selectedCalendar === 'All') return console.log('selectedCalendar - ALL (전체 일정 그리기)'); //debug//
    CALENDAR.getGroupAllEvents(selectedCalendar);
  }, [selectedCalendar]);

  return (
    <div className="calendar">
      <table>
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <th className={`Day= day-${idx}`} key={day}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarRows.map((row: JSX.Element[], i: number) => (
            <tr key={i}>{row}</tr>
          ))}
        </tbody>
      </table>
      <EventDetails isOpen={detailsOn} eventId={groupEventId} onClose={detailsClose} />
      <EventModal
        isOpen={eventModalOn}
        onClose={eventModalClose}
        selectedDay={selectedDay}
        position={modalPosition}
      />
    </div>
  );
});

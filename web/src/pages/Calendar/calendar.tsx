import React, { useState, useEffect, useCallback } from 'react';
import { isSameDay, startOfMonth, endOfMonth, addDays, format } from 'date-fns';

import EventModal from '@components/Canlendar/EventModal';
import EventDetails from '@components/Canlendar/EventDetails';
import * as CALENDAR from '@services/calendarAPI';
import {
  useGroupEventStore,
  useNowCalendarStore,
  useSelectedDayStore,
  useSocialEventStore,
  useUserInfoStore,
} from '@store/index';

import '@styles/calendar.css';

type CalendarProps = {
  isPrevMonth: boolean;
  isNextMonth: boolean;
  currentMonth: Date;
};

export default React.memo(function CalendarPage({
  isPrevMonth,
  isNextMonth,
  currentMonth,
}: CalendarProps) {
  const { selectedDay, setSelectedDay } = useSelectedDayStore((state) => ({
    selectedDay: state.selectedDay,
    setSelectedDay: state.setSelectedDay,
  }));

  const socialEvents = useSocialEventStore((state) => state.socialEvents);
  const groupEvents = useGroupEventStore((state) => state.groupEvents);
  const userCalendarId = useUserInfoStore(
    (state) => state.userInfo?.userCalendarId?.userCalendarId || null,
  );
  const nowCalendarId = useNowCalendarStore((state) => state.nowCalendar);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // *****************? 특정 일자 이벤트 등록 Modal
  const [eventModalOn, setEventModalOn] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // *****************? 등록된 그룹 이벤트의 세부 slide-bar
  const [detailsOn, setDetailsOn] = useState<boolean>(false);
  const [groupEventId, setGroupEventId] = useState<string | null>(null);

  // *****************? 최초 달력 일정 Rendering
  useEffect(() => {
    if (!nowCalendarId) return;

    if (nowCalendarId === 'All') return console.log('전체 일정 그리기');
    CALENDAR.getCalEvents(nowCalendarId).catch(console.error);
  }, [nowCalendarId]);

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

  const handleDetails = (evnetId: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!groupEventId || evnetId !== groupEventId) {
      setGroupEventId(evnetId);
      setDetailsOn(true);
    } else {
      detailsClose();
      setGroupEventId(null);
    }
  };

  // *****************? 자식컴포넌트 전달을 위한 callback 최적화
  const eventModalClose = useCallback(() => {
    setEventModalOn(false);
  }, []);

  const detailsClose = useCallback(() => {
    setDetailsOn(false);
  }, []);

  // *****************? 달력 생성 Logic
  const buildCalendarDays = () => {
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
  };

  // *****************? 세부 일정 및 이벤트 생성 Logic
  const buildCalendarTag = (calendarDays: Date[]) => {
    const eventMap = new Map<string, JSX.Element[]>();

    // ************* 소셜 이벤트 생성
    socialEvents.forEach((event) => {
      const eventDate = format(new Date(event.startAt), 'yyyy-MM-dd');
      const existingEvents = eventMap.get(eventDate) || [];
      existingEvents.push(
        <li className="social-title" key={existingEvents.length}>
          {event.title || 'NO-TITLE'}
        </li>,
      );
      eventMap.set(eventDate, existingEvents);
    });

    // ************* 그룹 이벤트 생성
    groupEvents.forEach((event) => {
      const eventDate = format(new Date(event.startAt), 'yyyy-MM-dd');
      const existingEvents = eventMap.get(eventDate) || [];
      existingEvents.push(
        <li
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          onClick={(e) => handleDetails(event.groupEventId, e)}
          className="group-event"
          style={{ backgroundColor: `${event.color === 'blue' ? '#0086FF' : '${event.color}'}` }}
          key={event.groupEventId}
        >
          {event.title || 'No Title'}
        </li>,
      );
      eventMap.set(eventDate, existingEvents);
    });

    return calendarDays.map((day: Date, i: number) => {
      const localDayKey = format(day, 'yyyy-MM-dd');
      const eventElements = eventMap.get(localDayKey) || [];

      if (day.getMonth() < currentMonth.getMonth()) {
        return (
          <td key={i} className="prevMonthDay">
            <div>{isPrevMonth ? day.getDate() : ''}</div>
            <ul id="event-box">{eventElements}</ul>
          </td>
        );
      }
      if (day.getMonth() > currentMonth.getMonth()) {
        return (
          <td key={i} className="nextMonthDay">
            <div>{isNextMonth ? day.getDate() : ''}</div>
            <ul id="event-box">{eventElements}</ul>
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
          <div className="day">{day.getDate()}</div>
          <ul id="event-box">{eventElements}</ul>
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
        userCalendarId={userCalendarId}
        position={modalPosition}
      />
    </div>
  );
});

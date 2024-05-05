import React, { useState, useEffect, useCallback } from 'react';
import { isSameDay, startOfMonth, endOfMonth, addDays } from 'date-fns';

import EventModal from '@components/Canlendar/EventModal';
import EventDetails from '@components/Canlendar/EventDetails';
import * as CALENDAR from '@services/calendarAPI';
import {
  useGroupEventStore,
  useNowCalendarStore,
  useSetDayStore,
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
  const { selectedDay, setSelectedDay } = useSetDayStore((state) => ({
    selectedDay: state.selectedDay,
    setSelectedDay: state.setSelectedDay,
  }));
  const socialEvents = useSocialEventStore((state) => state.socialEvents);
  const groupEvents = useGroupEventStore((state) => state.groupEvents);

  const userCalendarId = useUserInfoStore((state) => state.userInfo?.userCalendarId || null);
  const nowCalendarId = useNowCalendarStore((state) => state.nowCalendar);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const [detailsOn, setDetailsOn] = useState<boolean>(false);
  const [groupEventId, setGroupEventId] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (nowCalendarId) {
      CALENDAR.getCalEvents(nowCalendarId).catch(console.error);
    }
  }, [nowCalendarId]);

  const handleDayClick = (day: Date, e: React.MouseEvent<HTMLTableCellElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ x: rect.left, y: rect.top });

    if (selectedDay && isSameDay(day, selectedDay)) {
      setModalIsOpen(!modalIsOpen);
    } else {
      setSelectedDay(day);
      setModalIsOpen(false);
    }
  };

  const detailsClose = useCallback(() => {
    setDetailsOn(false);
  }, []);

  const handleDetails = (evnetId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!groupEventId || evnetId !== groupEventId) {
      setGroupEventId(evnetId);
      setDetailsOn(true);
    } else {
      detailsClose();
      setGroupEventId(null);
    }
  };

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

  const buildCalendarTag = (calendarDays: Date[]) => {
    const eventMap = new Map<string, JSX.Element[]>();

    socialEvents.forEach((event) => {
      const eventDate = event.startAt.split('T')[0];
      const existingEvents = eventMap.get(eventDate) || [];
      existingEvents.push(
        <div className="kakao-title" key={existingEvents.length}>
          {event.title || 'No Title'}
        </div>,
      );
      eventMap.set(eventDate, existingEvents);
    });

    groupEvents.forEach((event) => {
      const eventDate = event.startAt.split('T')[0];
      const existingEvents = eventMap.get(eventDate) || [];
      existingEvents.push(
        <div
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          onClick={(e) => handleDetails(event.groupEventId, e)}
          className="group-event rounded transform transition duration-300 hover:shadow-lg hover:-translate-y-1"
          style={{ backgroundColor: `${event.color === 'blue' ? '#0086FF' : '${event.color}'}` }}
          key={event.groupEventId}
        >
          {event.title || 'No Title'}
        </div>,
      );
      eventMap.set(eventDate, existingEvents);
    });

    return calendarDays.map((day: Date, i: number) => {
      const localDayKey = [
        day.getFullYear(),
        ('0' + (day.getMonth() + 1)).slice(-2),
        ('0' + day.getDate()).slice(-2),
      ].join('-');

      const eventElements = eventMap.get(localDayKey) || [];

      if (day.getMonth() < currentMonth.getMonth()) {
        return (
          <td key={i} className="prevMonthDay">
            <div>{isPrevMonth ? day.getDate() : ''}</div>
            {eventElements}
          </td>
        );
      }
      if (day.getMonth() > currentMonth.getMonth()) {
        return (
          <td key={i} className="nextMonthDay">
            <div>{isNextMonth ? day.getDate() : ''}</div>
            {eventElements}
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
          {eventElements}
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
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        selectedDay={selectedDay}
        userCalendarId={userCalendarId}
        position={modalPosition}
      />
    </div>
  );
});

import React, { useState, useEffect } from 'react';
import { isSameDay, startOfMonth, endOfMonth, addDays } from 'date-fns';
import EventModal from '@components/Canlendar/EventModal';

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
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    getCalendarEvent();
  }, [nowCalendarId, currentMonth]);

  const getCalendarEvent = async () => {
    if (!nowCalendarId) return '';
    try {
      await CALENDAR.getCalEvents(nowCalendarId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDayClick = (day: Date, event: React.MouseEvent<HTMLTableCellElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({ x: rect.left, y: rect.top });

    if (selectedDay && isSameDay(day, selectedDay)) {
      setModalIsOpen(!modalIsOpen);
    } else {
      setSelectedDay(day);
      setModalIsOpen(false);
    }
  };

  const buildCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);

    const days: Date[] = [];
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day = addDays(day, 1)) {
      days.push(day);
    }

    // Add days from previous and next months to fill the weeks
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

    const allEvent = [...socialEvents, ...groupEvents];

    allEvent.forEach((event) => {
      const eventDate = event.startAt.split('T')[0];
      const existingEvents = eventMap.get(eventDate) || [];
      existingEvents.push(
        <div className="kakao-title" key={existingEvents.length}>
          {event.title || 'No Title'}
        </div>,
      );
      eventMap.set(eventDate, existingEvents);
    });

    // groupEvents.forEach((event) => {});

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
            {daysOfWeek.map((day, i) => (
              <th key={i} className={`day-${i}`}>
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

import React, { useState } from 'react';

import CalSchedule from '@components/Canlendar/CalSchedule';
import Schedule from '@components/Canlendar/Schedule';
import ScheduleModal from '@components/Canlendar/ScheduleModal';

import { useToggle } from '@hooks/useToggle';
import { useSetDay, useSocialEventStore } from '@store/index';
import { KakaoEvent } from '@type/index';

import '@styles/calendar.css';

type CalendarProps = {
  isPrevMonth: boolean;
  isNextMonth: boolean;
  currentMonth: Date;
};

export default function CalendarPage({
  isPrevMonth,
  isNextMonth,
  currentMonth,
}: CalendarProps) {
  const { isOn, toggle } = useToggle(false);
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const [schedule, setSchedule] = useState<{ [key: string]: JSX.Element[] }>(
    {},
  );
  const { selectedDay, setSelectedDay } = useSetDay((state) => ({
    selectedDay: state.selectedDay,
    setSelectedDay: state.setSelectedDay,
  }));
  const [currentDayKey, setCurrentDayKey] = useState<string>('');
  const socialEvents = useSocialEventStore((state) => state.socialEvents);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDay = (toDay: Date, compareDay?: Date | null) => {
    if (
      toDay.getFullYear() === compareDay?.getFullYear() &&
      toDay.getMonth() === compareDay?.getMonth() &&
      toDay.getDate() === compareDay?.getDate()
    ) {
      return true;
    }
    return false;
  };

  const onClickDay = (day: Date) => {
    const dayKey = day.toISOString().split('T')[0];
    setCurrentDayKey(dayKey);
    setSelectedDay(day);
    toggle(); // Open or close the modal
  };

  const addSchedule = (title: string) => {
    const newSchedule = (
      <div
        key={currentDayKey + (schedule[currentDayKey]?.length || 0)}
        className="event-title"
      >
        {title}
      </div>
    );
    const updatedSchedules = {
      ...schedule,
      [currentDayKey]: [...(schedule[currentDayKey] || []), newSchedule],
    };
    setSchedule(updatedSchedules);
    toggle(); // Close the modal after adding the schedule
  };

  const buildCalendarDays = () => {
    const curMonthStartDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    ).getDay();

    const curMonthEndDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    );

    const prevMonthEndDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0,
    );
    const nextMonthStartDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    const days: Date[] = Array.from({ length: curMonthStartDate }, (_, i) => {
      return new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        prevMonthEndDate.getDate() - i,
      );
    }).reverse();

    days.push(
      ...Array.from(
        { length: curMonthEndDate.getDate() },
        (_, i) =>
          new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1),
      ),
    );

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      days.push(
        ...Array.from(
          { length: remainingDays },
          (_, i) =>
            new Date(
              nextMonthStartDate.getFullYear(),
              nextMonthStartDate.getMonth(),
              i + 1,
            ),
        ),
      );
    }
    return days;
  };

  const buildCalendarTag = (calendarDays: Date[]) => {
    return calendarDays.map((day: Date, i: number) => {
      const dayKey = day.toISOString().split('T')[0];
      const daySchedules = schedule[dayKey] || [];

      //* 소셜 일정 render *//
      const eventsForDay = socialEvents.filter((event) => {
        const eventDate = new Date(event.startAt).toISOString().split('T')[0];
        return eventDate === dayKey;
      });

      const eventElements = eventsForDay.map((event, idx) => (
        <div key={idx} className="event-title">
          {event.title || 'No Title'}
        </div>
      ));
      //* *************** *//

      if (day.getMonth() < currentMonth.getMonth()) {
        return (
          <td key={i} className="prevMonthDay">
            <div>{isPrevMonth ? day.getDate() : ''}</div>
            {eventElements}
            <CalSchedule schedule={daySchedules} day={day} />
          </td>
        );
      }
      if (day.getMonth() > currentMonth.getMonth()) {
        return (
          <td key={i} className="nextMonthDay">
            <div>{isNextMonth ? day.getDate() : ''}</div>
            {eventElements}
            <CalSchedule schedule={daySchedules} day={day} />
          </td>
        );
      }

      const dayOfWeek = day.getDay();
      const isToday = isSameDay(day, today);
      let dayClasses = `Day day-${dayOfWeek}`;
      if (isToday) dayClasses += ' today';
      if (isSameDay(day, selectedDay)) dayClasses += ' choiceDay';

      return (
        <td key={i} className={dayClasses} onClick={() => onClickDay(day)}>
          <div className="day">{day.getDate()}</div>
          {eventElements}
          <CalSchedule schedule={daySchedules} day={day} />
        </td>
      );
    });
  };

  const divideWeek = (calendarTags: JSX.Element[]) => {
    return calendarTags.reduce(
      (acc: JSX.Element[][], day: JSX.Element, i: number) => {
        if (i % 7 === 0) acc.push([day]);
        else acc[acc.length - 1].push(day);
        return acc;
      },
      [],
    );
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
      <ScheduleModal isOpen={isOn} onSave={(title) => addSchedule(title)} />
    </div>
  );
}

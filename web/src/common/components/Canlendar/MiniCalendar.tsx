import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { isSameDay, startOfMonth, endOfMonth, addDays, parseISO, isWithinInterval } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import * as CALENDAR from '@services/calendarAPI';
import * as FEED from '@services/eventFeedAPI';

import { Calendar, EventFeed } from '@type/index';
import { useGroupEventListStore, useSelectedDayStore } from '@store/index';

import '@styles/miniCalendar.css';
import useToast from '@hooks/useToast';

type CalendarProps = {
  isPrevMonth: boolean;
  isNextMonth: boolean;
  currentMonth: Date;
  nowCalendar: Calendar | 'All';
  setFeedList: Dispatch<SetStateAction<EventFeed[]>>;
};

// TODO 일정 그릴 때, 그룹 캘린더 별로 구분할 수 있도록 색 지정해서 그릴 필요 있음.
export default React.memo(function MiniCalendar({
  isPrevMonth,
  isNextMonth,
  currentMonth,
  nowCalendar,
  setFeedList,
}: CalendarProps) {
  const { selectedDay, setSelectedDay } = useSelectedDayStore();
  const { groupEventList } = useGroupEventListStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //************ 함수

  const handleDayClick = async (day: Date): Promise<void> => {
    setSelectedDay(day);

    const event = groupEventList.find((event) => {
      const startAt = event.startAt;
      const endAt = event.endAt;
      return isWithinInterval(day, { start: startAt, end: endAt });
    });

    if (event) {
      const res = await FEED.getAllFeedInEvent(event.groupEventId);
      if (res.length === 0) {
        useToast('warning', '선택한 날짜에 등록된 피드가 없습니다.');
        setFeedList([]);
        return;
      }
      setFeedList(res);
    } else {
      useToast('error', '이벤트가 등록된 날짜를 선택해주세요.');
      setFeedList([]);
    }
  };

  const fetchEventList = async () => {
    if (nowCalendar !== 'All') await CALENDAR.getGroupAllEvents(nowCalendar);
  };

  // *****************? 컴포넌트 초기화
  useEffect(() => {
    fetchEventList();
  }, [nowCalendar]);

  // *****************? 달력 생성 Logic
  const buildCalendarDays = useCallback(() => {
    const timeZone = 'Asia/Seoul';

    const firstDayOfMonth = toZonedTime(startOfMonth(currentMonth), timeZone);
    const lastDayOfMonth = toZonedTime(endOfMonth(currentMonth), timeZone);

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
  }, [currentMonth]);

  // *****************? 세부 일정 및 이벤트 생성 Logic
  const buildCalendarTag = (calendarDays: Date[]) => {
    return calendarDays.map((day: Date, i: number) => {
      if (day.getMonth() < currentMonth.getMonth()) {
        return (
          <td key={i} className="MprevMonthDay">
            <div>{isPrevMonth ? day.getDate() : ''}</div>
          </td>
        );
      }
      if (day.getMonth() > currentMonth.getMonth()) {
        return (
          <td id="Mtd" key={i} className="MnextMonthDay">
            <div>{isNextMonth ? day.getDate() : ''}</div>
          </td>
        );
      }

      const dayOfWeek = day.getDay();
      const isToday = isSameDay(day, today);
      let dayClasses = `MDay day-${dayOfWeek}`;
      if (isToday) dayClasses += ' Mtoday';
      if (selectedDay && isSameDay(day, selectedDay)) dayClasses += ' MchoiceDay';

      const isEventDay = groupEventList.some((event) => {
        const startAt = event.startAt;
        const endAt = event.endAt;
        return isWithinInterval(day, { start: startAt, end: endAt });
      });

      if (isEventDay) dayClasses += ' MeventDay';

      return (
        <td id="Mtd" key={i} className={`${dayClasses}`} onClick={() => handleDayClick(day)}>
          <span className="Mday">{day.getDate()}</span>
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
    <div id="Mcalendar">
      <table id="Mtable">
        <thead>
          <tr id="Mtr">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <th className={`Day= day-${idx}`} key={day}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarRows.map((row: JSX.Element[], i: number) => (
            <tr id="Mtr" key={i}>
              {row}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

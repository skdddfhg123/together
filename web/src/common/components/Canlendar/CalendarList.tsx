import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as CALENDAR from '@services/calendarAPI';
import { useCalendarListStore, useNowCalendarStore } from '@store/index';
import { Calendar } from '@type/index';

import defaultCover from '@assets/default_cover.png';
interface CalendarListProps {
  isOpen: boolean;
}

export default function CalendarList({ isOpen }: CalendarListProps) {
  const { calendars } = useCalendarListStore();
  const { setNowCalendar } = useNowCalendarStore();

  useEffect(() => {
    try {
      CALENDAR.getAllCalendar();
    } catch (err) {
      console.error('전체 캘린더 받아오기 실패', err);
    }
  }, []);

  const ChangeCalendar = (calendarId: string | null) => {
    if (calendarId) setNowCalendar(calendarId);
    else console.error('캘린더 아이디를 찾을 수 없습니다.');
  };

  const renderCalendarList = () => {
    return calendars.length > 0 ? (
      calendars.map((calendar: Calendar, idx: number) => (
        <li
          className={`py-2 text-l cursor-pointer flex items-center`}
          onClick={() => ChangeCalendar(calendar.calendarId)}
          key={idx}
        >
          <img className="m-2 w-36" src={calendar.coverImage || defaultCover} alt="no Img"></img>
          <div>
            <div className="text-lg">{`${calendar.title}\n`}</div>
            <div className="text-gray-400">{`[ ${calendar.attendees.length} 명 ]`}</div>
          </div>
        </li>
      ))
    ) : (
      <></>
    );
  };

  return (
    <section
      className={`h-fit overflow-scroll ${isOpen ? 'w-128' : 'w-0'}`}
      id={isOpen ? 'slideIn-left' : 'slideOut-left'}
    >
      <ul className={`h-fit flex flex-col`}>
        <li
          className={`py-2 text-l cursor-pointer flex items-center`}
          onClick={() => ChangeCalendar(sessionStorage.getItem('MainCalendar'))}
        >
          <img className="m-2 w-36" src={defaultCover} alt="no Img"></img>
          메인
        </li>
        {renderCalendarList()}
      </ul>
      <Link
        className="p-4 text-xl w-fit flex items-center m-16 my-10 text-gray-400 hover:text-custom-main"
        to={`/createGroup`}
      >
        새 캘린더 그룹 만들기
      </Link>
    </section>
  );
}

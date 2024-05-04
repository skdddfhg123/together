import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import * as CALENDAR from '@services/calendarAPI';
import { useCalendarStore } from '@store/index';
import { Calendar } from '@type/index';

import defaultCover from '@assets/default_cover.png';
interface CalendarListProps {
  isOpen: boolean;
}

export default function CalendarList({ isOpen }: CalendarListProps) {
  const navigate = useNavigate();
  const { calendars } = useCalendarStore();

  useEffect(() => {
    try {
      CALENDAR.getAllCalendar();
    } catch (error) {
      if ((error as AxiosError).code === 'NO_TOKEN') {
        navigate('/signin');
      } else {
        console.error('전체 캘린더 받아오기 실패', error);
      }
    }
  }, []);

  const renderCalendarList = () => {
    return calendars.length > 0 ? (
      calendars.map((calendar: Calendar, idx: number) => (
        <li
          className={`py-2 text-l cursor-pointer flex items-center`}
          onClick={() => CALENDAR.getCalEvents(`${calendar.title} - ${idx}`)}
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
          onClick={() => CALENDAR.getCalEvents('main')}
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

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';
import { useCalendarListStore, useNowCalendarStore } from '@store/index';
import { Calendar } from '@type/index';

import defaultCover from '@assets/default_cover.png';
interface CalendarListProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarList({ isOpen, onClose }: CalendarListProps) {
  const { calendars } = useCalendarListStore();
  const { setNowCalendar } = useNowCalendarStore();

  useEffect(() => {
    CALENDAR.getAllCalendar();
  }, []);

  const ChangeCalendar = (calendarId: string | null) => {
    if (calendarId) setNowCalendar(calendarId);
    else console.error('캘린더 아이디를 찾을 수 없습니다.');
    onClose();
  };

  const renderCalendarList = () => {
    return calendars.length > 0 ? (
      calendars.map((calendar: Calendar, idx: number) => (
        <li
          className={`w-full py-2 text-l cursor-pointer flex items-center`}
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
      <h2 className="text-center py-10">소속된 그룹 캘린더가 없습니다.</h2>
    );
  };

  return (
    <section
      className={`h-fit flex flex-col items-center overflow-hidden ${isOpen ? 'w-full' : 'w-0'}`}
      id={isOpen ? 'slideIn-left' : 'slideOut-left'}
    >
      <ul className={`h-fit w-full items-center flex flex-col`}>
        <h2
          className="p-4 hover:text-custom-main hover:cursor-pointer"
          onClick={() => {
            ChangeCalendar('All');
            USER.firstRender();
          }}
        >
          일정 모아보기
        </h2>
        {renderCalendarList()}
      </ul>
      <Link className="p-4 text-xl text-gray-400 hover:text-custom-main" to={`/createGroup`}>
        + 새 캘린더 그룹 만들기
      </Link>
    </section>
  );
}

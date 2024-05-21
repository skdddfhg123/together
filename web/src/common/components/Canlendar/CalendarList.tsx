import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';

import { Calendar } from '@type/index';
import { useCalendarListStore, useSelectedCalendarStore } from '@store/index';

import defaultCover from '@assets/default_cover.png';
import calendarImg from '@assets/calendar_img.jpg';

interface CalendarListProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarList({ isOpen, onClose }: CalendarListProps) {
  const { calendarList, isLoaded } = useCalendarListStore();
  const { setSelectedCalendar } = useSelectedCalendarStore();

  useEffect(() => {
    if (!isLoaded) CALENDAR.getMyAllCalendar();
  }, []);

  const ChangeCalendar = (calendar: Calendar | 'All') => {
    if (calendar) {
      setSelectedCalendar(calendar);
      if (calendar !== 'All') getMemberEventList(calendar);
    } else console.error('캘린더 아이디를 찾을 수 없습니다.');
    onClose();
  };

  const renderCalendarList = () => {
    return calendarList.length > 0 ? (
      calendarList.map((calendar: Calendar, idx: number) => (
        <li
          className={`w-full py-2 text-l cursor-pointer flex items-center ANI-right hover:scale-125`}
          onClick={() => ChangeCalendar(calendar)}
          key={idx}
        >
          <img className="mx-2 w-32 rounded" src={calendar.coverImg || defaultCover} alt="no Img" />
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

  const getMemberEventList = async (calendar: Calendar) => {
    await CALENDAR.getMemberAndMemberEvents(calendar.calendarId);
  };

  return (
    <section
      className={`SCROLL-hide FLEX-horizC h-fit ${isOpen ? 'w-full' : 'w-0'}`}
      id={isOpen ? 'SLIDEin-left' : 'SLIDEout-left'}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-2 text-3xl text-black hover:text-gray-600"
        aria-label="Close"
      >
        &times;
      </button>
      <ul className={`h-fit w-full`}>
        <div
          className={`w-full py-2 flex items-center text-l cursor-pointer ANI-right hover:scale-125`}
          onClick={() => ChangeCalendar('All')}
        >
          <img
            className="m-2 w-32 max-h-24 object-cover rounded-2xl"
            src={calendarImg}
            alt="no Img"
          ></img>
          <div>
            <div
              className="text-lg font-bold rounded
            "
            >
              나의 모든 일정
            </div>
          </div>
        </div>
        {renderCalendarList()}
      </ul>
      <Link className="p-4 text-xl text-gray-400 hover:text-custom-main" to={`/createGroup`}>
        + 새 캘린더 그룹 만들기
      </Link>
    </section>
  );
}

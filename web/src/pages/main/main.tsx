import React, { useState, useEffect, useCallback } from 'react';

import Calendar from '@pages/Calendar/calendar';
import CalendarList from '@components/Canlendar/CalendarList';
import UserModal from '@components/User/Profile/UserModal';
import RightMenuTap from '@components/Menu/RightMenuTap';
import { useToggle } from '@hooks/useToggle';

// import { transToKorDate } from '@utils/dateTranslate';
import * as KAKAO from '@services/KakaoAPI';
import { SocialEvent } from '@type/index';
import { useSocialEventStore } from '@store/index';
import menuImg from '@assets/calendar_menu.webp';
import syncImg from '@assets/sync.png';

import '@styles/main.css';

export default function MainPage() {
  const [calendarID, setCalendarID] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { isOn, toggle } = useToggle(false);

  useEffect(() => {
    const id = sessionStorage.getItem('calendarID');
    setCalendarID(id);
  }, []);

  const prevCalendar = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, currentMonth.getDate()),
    );
  };

  const nextCalendar = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, currentMonth.getDate()),
    );
  };

  const getSocialEvents = async () => {
    try {
      const kakaoEvents = await KAKAO.GetEvents();
      if (!kakaoEvents) throw new Error('카카오 일정 받아오기 실패');

      console.log(`kakao Events :`, kakaoEvents);
      const eventLists = kakaoEvents.map(
        (event: KakaoEvent): SocialEvent => ({
          title: event.title || '카카오 일정',
          // startAt: transToKorDate(event.startAt, 9),
          // endAt: transToKorDate(event.endAt, 9),
          startAt: event.startAt,
          endAt: event.endAt,
          isPast: event.deactivatedAt,
          userCalendarId: event.userCalendar?.userCalendarId,
          social: event.social,
          socialEventId: event.socialEventId,
        }),
      );
      useSocialEventStore.getState().setSocialEvents(eventLists);
      console.log(`eventLists`, eventLists);
    } catch (e) {
      console.error('Failed to fetch social events:', e);
    }
  };

  return (
    <>
      <header id="calHeader">
        <img id="calHeader-leftSidebar" src={menuImg} alt="calendarList-button" onClick={toggle} />
        <h1 id="calendarLogo">Toogether</h1>
        <div id="calHeader-title">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </div>
        <nav className="calHeader-button">
          <button id="prevMonth-button" onClick={prevCalendar}>
            ◀
          </button>
          <button id="nextMonth-button" onClick={nextCalendar}>
            ▶
          </button>
        </nav>
        <div id="right-menu">
          <img id="sync-button" src={syncImg} alt="syncCalendar-button" onClick={getSocialEvents} />
          <UserModal />
        </div>
      </header>
      <main id="mainSection">
        <aside
          className={`h-full left-sideBar flex flex-col overflow-hidden 
            transition-all duration-500 ${isOn ? 'w-128' : 'w-0'}`}
          id={isOn ? 'slideIn-left' : 'slideOut-left'}
        >
          {isOn && <CalendarList isOpen={isOn} />}
        </aside>
        <Calendar calendarId={calendarID} isPrevMonth isNextMonth currentMonth={currentMonth} />
        <aside className="right-sideBar">
          <RightMenuTap />
        </aside>
      </main>
    </>
  );
}

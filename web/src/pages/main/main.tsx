import React, { useState, useEffect, useCallback } from 'react';

import Calendar from '@pages/Calendar/calendar';
import CalendarList from '@components/Canlendar/CalendarList';
import UserModal from '@components/User/Profile/UserModal';
import RightMenuTap from '@components/Menu/RightMenuTap';
import { useToggle } from '@hooks/useToggle';

import * as KAKAO from '@services/KakaoAPI';
import * as USER from '@services/userAPI';
import { useNowCalendarStore, useSocialEventStore, useUserInfoStore } from '@store/index';
import menuImg from '@assets/calendar_menu.webp';
import syncImg from '@assets/sync.png';

import '@styles/main.css';

export default function MainPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { isOn, toggle } = useToggle(false);

  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const setNowCalendarId = useNowCalendarStore((state) => state.setNowCalendar);

  const getUserAndCalendar = useCallback(async () => {
    try {
      const userInfo = await USER.getInfo();
      if (!userInfo) throw new Error('유저 정보 받아오기 실패');
      console.log(`userInfo Store : `, userInfo);

      setUserInfo(userInfo);
      // 여기서 바로 nowCalendarId 설정
      if (userInfo.userCalendarId) {
        setNowCalendarId(userInfo.userCalendarId);
        console.log(`현재 보고있는 캘린더`, userInfo.userCalendarId); //debug//
      }
    } catch (e) {
      console.error(e);
    }
  }, [setUserInfo, setNowCalendarId]);

  useEffect(() => {
    getUserAndCalendar();
  }, [getUserAndCalendar]);

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

  const getSocialEvents = useCallback(async () => {
    try {
      const kakaoEvents = await KAKAO.GetEvents();
      if (!kakaoEvents) throw new Error('카카오 일정 받아오기 실패');
    } catch (e) {
      console.error('Failed to fetch social events:', e); //debug//
    }
  }, [KAKAO, useSocialEventStore]);

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
            transition-all duration-300 ${isOn ? 'w-128' : 'w-0'}`}
          id={isOn ? 'slideIn-left' : 'slideOut-left'}
        >
          {isOn && <CalendarList isOpen={isOn} />}
        </aside>
        <Calendar isPrevMonth isNextMonth currentMonth={currentMonth} />
        <aside className="right-sideBar">
          <RightMenuTap />
        </aside>
      </main>
    </>
  );
}

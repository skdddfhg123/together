import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

import * as KAKAO from '@services/KakaoAPI';
import * as USER from '@services/userAPI';
import * as CALENDAR from '@services/calendarAPI';
import useToggle from '@hooks/useToggle';

import Calendar from '@pages/Calendar/calendar';
import CalendarList from '@components/Canlendar/CalendarList';
import UserModal from '@components/User/Profile/UserSetting';
import RightMenuTap from '@components/Menu/RightMenuTap';

import menuImg from '@assets/calendar_menu.webp';
import syncImg from '@assets/sync.png';

import '@styles/main.css';
import { useNavigate } from 'react-router-dom';

const Redis_Url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_ALERT_SOCKET_PORT}`;

export default function MainPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { isOn, toggle } = useToggle(false);

  const RendarUserAndCalendar = useCallback(async () => {
    const res = await USER.firstRender();
    if (!res) navigate('/signin');
  }, []);

  const getSocialEvents = useCallback(async () => {
    // ***************TODO 구글 및 outlook API 등록 필요
    const kakaoRes = await KAKAO.GetEvents();
    if (!kakaoRes) return;
    // const googleRes = await GOOGLE.GetEvents();
    // if (!googleRes) return;
    // const outlookRes = await OUTLOOK.GetEvents();
    // if (!outlookRes) return;

    console.log(`Main 동기화 종료`); //debug//
    RendarUserAndCalendar();
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

  // *****************? 최초 렌더링
  useEffect(() => {
    CALENDAR.getMyAllCalendar();
    RendarUserAndCalendar();
  }, []);

  // *****************? 실시간 알림을 위한 소켓 연결
  useEffect(() => {
    const socket = io(Redis_Url);
    console.log(`Redis Socket Connected`); //debug//

    // TODO TOAST로 만들기
    socket.on('redisMessage', ({ channel, message }) => {
      alert(`${channel}님이 보내셨습니다. ${message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
          id={`${isOn ? 'SLIDEin-left' : 'SLIDEout-left'}`}
          className={`FLEX-horiz h-full transition-all duration-300 ${isOn ? 'w-128' : 'w-0'}`}
        >
          {isOn && <CalendarList isOpen={isOn} onClose={toggle} />}
        </aside>
        <Calendar isPrevMonth isNextMonth currentMonth={currentMonth} />
        <aside id="right-sideBar">
          <RightMenuTap />
        </aside>
      </main>
    </>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';
import { io } from 'socket.io-client';

import * as USER from '@services/userAPI';
import * as CALENDAR from '@services/calendarAPI';
import useToggle from '@hooks/useToggle';

import Calendar from '@pages/Calendar/calendar';
import CalendarList from '@components/Canlendar/CalendarList';
import UserModal from '@components/User/Profile/UserSetting';
import RightMenuTap from '@components/Menu/RightMenuTap';

import logoImg from '@assets/toogether_noBG.png';
import menuImg from '@assets/calendar_menu.webp';

import '@styles/main.css';
import FeedPage from '@pages/Feed/feed';

const Redis_Url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_ALERT_SOCKET_PORT}`;

export default function MainPage() {
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);
  const [toggleFeed, setToggleFeed] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const RendarUserAndCalendar = useCallback(async () => {
    const res = await USER.firstRender();
    if (!res) navigate('/signin');
  }, [navigate]);

  const switchingFeedAndCalendar = useCallback(() => {
    if (toggleFeed) setToggleFeed(false);
    else setToggleFeed(true);
  }, [toggleFeed]);

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
  }, [RendarUserAndCalendar]);

  // *****************? 실시간 알림을 위한 소켓 연결
  useEffect(() => {
    const socket = io(Redis_Url);
    console.log(`Redis Socket Connected`); //debug//

    socket.on('redisMessage', ({ message }) => {
      const cleanMessage = DOMPurify.sanitize(message);
      toast.info(<div dangerouslySetInnerHTML={{ __html: cleanMessage }} />, {
        containerId: 'memberAlert',
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <header id="calHeader">
        <img id="calHeader-leftSidebar" src={menuImg} alt="calendarList-button" onClick={toggle} />
        <section className="logo-section">
          <img id="calendarLogo" src={logoImg} alt="Toogether" onClick={RendarUserAndCalendar} />
          <div className="logo-bottom">
            <span id="calHeader-title">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </span>
            <nav className="month-controller">
              <button id="prevMonth-button" onClick={prevCalendar}>
                ◀
              </button>
              <button id="nextMonth-button" onClick={nextCalendar}>
                ▶
              </button>
            </nav>
          </div>
        </section>
        <div id="right-menu">
          <UserModal />
        </div>
      </header>
      <main id="mainSection">
        <aside
          id={`${isOn ? 'SLIDEin-left' : 'SLIDEout-left'}`}
          className={`FLEX-horiz h-full ANIMATION ${isOn ? 'w-114' : 'w-0'}`}
        >
          {isOn && <CalendarList isOpen={isOn} onClose={toggle} />}
        </aside>
        {toggleFeed ? (
          <FeedPage
            isPrevMonth
            isNextMonth
            currentMonth={currentMonth}
            onClose={switchingFeedAndCalendar}
          />
        ) : (
          <>
            <Calendar isPrevMonth isNextMonth currentMonth={currentMonth} />
          </>
        )}
        <aside id="right-sideBar">
          <RightMenuTap switchMain={switchingFeedAndCalendar} />
        </aside>
      </main>
    </>
  );
}

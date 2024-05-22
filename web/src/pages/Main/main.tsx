import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import Tutorial from '@components/User/Tutorial';
import SyncSocialEvent from '@components/Menu/SyncSocialEvent';

import logoImg from '@assets/toogether_noBG.png';
import menuImg from '@assets/calendar_menu.webp';
// import defaultBanner from '@assets/default_banner.png';
import alerm from '@assets/alermSound.mp3';

import '@styles/main.css';
import FeedPage from '@pages/Feed/feed';
import { useSelectedCalendarStore, useUserInfoStore } from '@store/index';

const Redis_Url = `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_ALERT_SOCKET_PORT}`;

export default function MainPage() {
  const navigate = useNavigate();
  const { userInfo } = useUserInfoStore();
  const { selectedCalendar } = useSelectedCalendarStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const { isOn, toggle } = useToggle(false);
  const [toggleFeed, setToggleFeed] = useState<boolean>(false);
  const [tutorial, setTutorial] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const closeTutorial = () => {
    setTutorial(false);
  };

  const welcomeTutorial = async () => {
    await USER.tutorial();
    setTutorial(true);
  };

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

  useEffect(() => {
    if (userInfo?.isFirst === true) {
      welcomeTutorial();
    } else {
      return;
    }
  }, [userInfo, RendarUserAndCalendar]);

  // *****************? 실시간 알림을 위한 소켓 연결
  useEffect(() => {
    const socket = io(Redis_Url);
    console.log(`Redis Socket Connected`); //debug//

    socket.on('redisMessage', async ({ channel, message }) => {
      if (channel === userInfo?.useremail) return;
      const parsedMessage = await JSON.parse(message);
      const cleanMessage = DOMPurify.sanitize(parsedMessage.text);
      toast.info(<div dangerouslySetInnerHTML={{ __html: cleanMessage }} />, {
        containerId: 'memberAlert',
      });
      console.log(`메세지 안 캘린더 id`, [parsedMessage, parsedMessage.calendarId]);
      console.log(`메세지 받았을 때 보고있는 캘린더`, selectedCalendar);

      audioRef.current?.play();

      if (selectedCalendar === 'All') return USER.firstRender();

      await CALENDAR.getGroupAllEvents(selectedCalendar);
      await CALENDAR.getMemberAndMemberEvents(selectedCalendar.calendarId);
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo, selectedCalendar]);

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
        <div id="banner">
          <div id="banner-title">
            <span className="text-4xl">
              {selectedCalendar !== 'All' ? selectedCalendar.title : '내 전체 일정'}
            </span>
            {selectedCalendar !== 'All' && <span>그룹 캘린더</span>}
          </div>
          <img
            id="calendar-banner"
            src={selectedCalendar !== 'All' ? selectedCalendar?.bannerImg : ''}
          />
        </div>
        <div id="right-menu">
          <SyncSocialEvent />
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
        {tutorial && <Tutorial isOpen={tutorial} onClose={closeTutorial} />}
        <audio ref={audioRef} src={alerm} preload="auto" />
      </main>
    </>
  );
}

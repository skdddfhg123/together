import React, { useState, useEffect } from 'react';

import Calendar from '@pages/Calendar/calendar';
import CalendarList from '@components/Canlendar/CalendarList';
import UserModal from '@components/User/Profile/UserModal';

import { useToggle } from '@hooks/useToggle';
import * as KAKAO from '@services/KakaoAPI';
import { useSocialEventStore } from '@store/index';
import { KakaoEvent } from '@type/index';
import menuImg from '@assets/calendar_menu.webp';
import syncImg from '@assets/sync.png';

import '@styles/main.css';

export default function MainPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [socialEvents, setSocialEvents] = useState<KakaoEvent[]>([]);

  const { isOn, toggle } = useToggle(false);

  const prevCalendar = (): void => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        currentMonth.getDate(),
      ),
    );
  };

  const nextCalendar = (): void => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        currentMonth.getDate(),
      ),
    );
  };

  const getSocialEvents = async () => {
    try {
      const res = await KAKAO.GetEvents();
      console.log(res.data);
      const eventLists = res.data.map(
        (event: any): KakaoEvent => ({
          title: event.title || '카카오톡 일정',
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
    } catch (e) {
      console.error('Failed to fetch social events:', e);
    }
  };

  useEffect(() => {
    console.log('socialEvents updated:', socialEvents);
  }, [socialEvents]);

  return (
    <>
      <header id="calHeader">
        <section id="left-Menu"></section>
        <img
          id="calHeader-leftExp"
          src={menuImg}
          alt="calendarList-button"
          onClick={toggle}
        />
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
          <img
            id="sync-button"
            src={syncImg}
            alt="syncCalendar-button"
            onClick={getSocialEvents}
          />
          <UserModal />
        </div>
      </header>
      <main id="mainSection">
        <aside
          className="left-sideBar"
          id={isOn ? 'calendarList-entering' : 'calendarList-exiting'}
        >
          {isOn && <CalendarList />}
        </aside>
        <Calendar
          isPrevMonth
          isNextMonth
          currentMonth={currentMonth}
          socialEvents={socialEvents}
        />
        <aside className="right-sideBar">
          <div>right SideBar</div>
        </aside>
      </main>
    </>
  );
}

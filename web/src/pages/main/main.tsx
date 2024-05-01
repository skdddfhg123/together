import React, { useState } from 'react';

import Calendar from '@pages/Calendar/calendar';
import CanlendarList from '@components/Canlendar/CanlendarList';

import useToggle from '@hooks/useToggle';
import menuImg from '@assets/calendar_menu.webp';
import * as API from '@utils/api';
import '@styles/main.css';

function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const accessToken = getCookie('accessToken');
export default function MainPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { isOn, toggle } = useToggle(false);

  const getProfile = async () => {
    try {
      const res = await API.get(`/auth/token-test`);
      console.log(res);
    } catch (e) {}
  };

  const prevCalendar = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        currentMonth.getDate(),
      ),
    );
  };

  const nextCalendar = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        currentMonth.getDate(),
      ),
    );
  };
  return (
    <>
      <header id="calHeader">
        <button id="calHeader-leftExp" onClick={toggle}>
          <img id="listImg-button" src={menuImg} alt="calendarList" />
        </button>
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
        <button onClick={getProfile}>쿠키</button>
      </header>
      <main id="mainSection">
        <aside id={isOn ? 'calendarList-entering' : 'calendarList-exiting'}>
          {isOn && <CanlendarList />}
        </aside>
        <Calendar isPrevMonth isNextMonth currentMonth={currentMonth} />
      </main>
    </>
  );
}

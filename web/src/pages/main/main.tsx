import React, { useState } from 'react';

import Calendar from '@pages/Calendar/calendar';
import CanlendarList from '@components/Canlendar/CanlendarList';

import useToggle from '@hooks/useToggle';
import menuImg from '@assets/calendar_menu.webp';
import '@styles/main.css';

export default function MainPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { isOn, toggle } = useToggle(false);

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

import React, { useState } from 'react';

import Calendar from './Calendar/calendar';
import CanlendarList from '../common/components/Canlendar/CanlendarList';

import '../common/style/main.css';
import menuImg from '../common/assets/calendar_menu.webp';

export default function Main() {
  const [isCalendarList, setIsCanlendarList] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const date: unknown = undefined;
  const [selectedDay, setSelectedDay] = useState<Date>(date as Date);

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
        <button
          id="calHeader-leftExp"
          onClick={() => {
            setIsCanlendarList(!isCalendarList);
          }}
        >
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
        <aside
          id={isCalendarList ? 'calendarList-entering' : 'calendarList-exiting'}
        >
          {isCalendarList && <CanlendarList isOpen={isCalendarList} />}
        </aside>
        <Calendar
          selectedDay={selectedDay}
          setSelectedDay={null}
          isPrevMonth
          isNextMonth
          currentMonth={currentMonth}
        />
      </main>
    </>
  );
}

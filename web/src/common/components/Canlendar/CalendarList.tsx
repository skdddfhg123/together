import React from 'react';

interface CalendarListProps {
  isOpen: boolean;
}

export default function CalendarList({ isOpen }: CalendarListProps) {
  return (
    <section
      className={`${isOpen ? 'w-100' : 'w-0'}`}
      id={isOpen ? 'slideIn-left' : 'slideOut-left'}
    >
      <h1>Hello Calendar !!!</h1>
      <button className="">새 캘린더 그룹 만들기</button>
    </section>
  );
}

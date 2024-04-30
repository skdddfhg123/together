import React from 'react';

interface CalendarListProps {
  isOpen: boolean;
}

export default function CanlendarList({ isOpen }: CalendarListProps) {
  return (
    <section>
      <h1>Hello Calendar !!!</h1>
      <button className="">새 캘린더 그룹 만들기</button>
    </section>
  );
}

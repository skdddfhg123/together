import React from 'react';
import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';
import { useNowCalendarStore } from '@store/index';

interface CalenderTapProps {
  onClose: () => void;
}

export default function CalenderSetTap({ onClose }: CalenderTapProps) {
  const { nowCalendar } = useNowCalendarStore();

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await CALENDAR.deleteGroupCalendar(nowCalendar);
    await USER.firstRender();
    onClose();
  };
  return (
    <>
      <header className="rMenuHeader">
        <h2>CalendarSet</h2>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </header>
      <section className="flex flex-row justify-center">
        <button className="btn my-4 p-4 hover:bg-custom-light rounded" onClick={handleDelete}>
          캘린더 삭제
        </button>
      </section>
    </>
  );
}

import React from 'react';
import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';

import { useSelectedCalendarStore } from '@store/index';

interface CalenderTapProps {
  onClose: () => void;
}

export default function CalenderSetTap({ onClose }: CalenderTapProps) {
  const { SelectedCalendar } = useSelectedCalendarStore();

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await CALENDAR.removeGroupCalendar(SelectedCalendar);
    await USER.firstRender();
    onClose();
  };
  return (
    <>
      <header className="rMenu-header">
        <h2>CalendarSet</h2>
        <button className="BTN" onClick={onClose}>
          Close
        </button>
      </header>
      <section className="FLEX-verC">
        <button className="BTN my-4 p-4 hover:bg-custom-light rounded" onClick={handleDelete}>
          캘린더 삭제
        </button>
      </section>
    </>
  );
}

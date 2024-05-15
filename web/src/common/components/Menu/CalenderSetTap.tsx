import React from 'react';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';

import { useSelectedCalendarStore } from '@store/index';

import CreateEmojiModal from '@components/Menu/Chat/CreateEmoji/CreateEmojiModal';
import useToggle from '@hooks/useToggle';

interface CalenderTapProps {
  onClose: () => void;
}

export default function CalenderSetTap({ onClose }: CalenderTapProps) {
  const { selectedCalendar } = useSelectedCalendarStore();
  const { isOn, toggle } = useToggle(false);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await CALENDAR.removeGroupCalendar(selectedCalendar);
    await USER.firstRender();
    onClose();
  };
  return (
    <>
      <header className="rMenu-header">
        <h2>CalendarSet</h2>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mr-2 text-3xl text-black hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
      </header>
      <section className="FLEX-verC">
        <button className="BTN my-4 p-4 hover:bg-custom-light rounded" onClick={handleDelete}>
          캘린더 삭제
        </button>
        <button className="BTN" type="button" onClick={toggle}>
          그룹 이모지 만들기
        </button>
        <CreateEmojiModal isOpen={isOn} onClose={toggle} />
      </section>
    </>
  );
}

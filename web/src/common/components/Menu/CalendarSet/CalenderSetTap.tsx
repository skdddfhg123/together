import React, { useState } from 'react';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';

import { useSelectedCalendarStore } from '@store/index';

import CreateEmojiModal from '@components/Menu/Emoji/CreateEmojiModal';
import CalendarBannerModal from '@components/Menu/CalendarSet/CalendarBannerModal';
import CalendarSetModal from '@components/Menu/CalendarSet/CalendarSetModal';

interface CalenderTapProps {
  onClose: () => void;
}

export default function CalenderSetTap({ onClose }: CalenderTapProps) {
  const { selectedCalendar } = useSelectedCalendarStore();
  const [tabIdx, setTabIdx] = useState(0);

  const closeAllModals = () => {
    setTabIdx(0);
  };

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
      <section className="FLEX-horizC space-y-4 py-4">
        <button
          className="BTN w-52 break-words text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          type="button"
          onClick={() => setTabIdx(1)}
        >
          캘린더 설정하기
        </button>
        <button
          className="BTN w-52 break-words text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          type="button"
          onClick={() => setTabIdx(2)}
        >
          캘린더 배너 등록
        </button>
        <button
          className="BTN w-52 text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          type="button"
          onClick={() => setTabIdx(3)}
        >
          그룹 이모지 만들기
        </button>
        <button
          className="BTN w-52 text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          onClick={handleDelete}
        >
          캘린더 삭제
        </button>
        <CreateEmojiModal isOpen={tabIdx === 3} onClose={closeAllModals} />
        <CalendarBannerModal
          selectedCalendar={selectedCalendar}
          isOpen={tabIdx === 2}
          onClose={closeAllModals}
        />
        <CalendarSetModal
          selectedCalendar={selectedCalendar}
          isOpen={tabIdx === 1}
          onClose={closeAllModals}
        />
      </section>
    </>
  );
}

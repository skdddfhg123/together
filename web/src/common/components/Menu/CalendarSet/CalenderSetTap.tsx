import React, { useState } from 'react';

import useToggle from '@hooks/useToggle';
import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';

import { useSelectedCalendarStore } from '@store/index';

import CreateEmojiModal from '@components/Menu/Emoji/CreateEmojiModal';
import CalendarBannerModal from '@components/Menu/CalendarSet/CalendarBannerModal';

interface CalenderTapProps {
  onClose: () => void;
}

export default function CalenderSetTap({ onClose }: CalenderTapProps) {
  const { selectedCalendar } = useSelectedCalendarStore();
  const { isOn, toggle } = useToggle(false);
  const [bannerUpdate, setBannerUpdate] = useState<boolean>(false);

  const toggleBannerModal = () => {
    if (bannerUpdate) setBannerUpdate(false);
    else setBannerUpdate(true);
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
          className="BTN w-52 text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          onClick={handleDelete}
        >
          캘린더 삭제
        </button>
        <button
          className="BTN w-52 text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          type="button"
          onClick={toggle}
        >
          그룹 이모지 만들기
        </button>
        <CreateEmojiModal isOpen={isOn} onClose={toggle} />
        <button
          className="BTN w-52 break-words text-2xl ANIMATION hover:bg-custom-main hover:text-white hover:scale-150 rounded-2xl"
          type="button"
          onClick={toggleBannerModal}
        >
          캘린더 배너
          <br /> 설정하기
        </button>
        <CalendarBannerModal
          selectedCalendar={selectedCalendar}
          isOpen={bannerUpdate}
          onClose={toggleBannerModal}
        />
      </section>
    </>
  );
}

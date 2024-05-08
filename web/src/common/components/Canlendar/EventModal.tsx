import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';

import * as CALENDAR from '@services/calendarAPI';
import useUpdateModalStyle from '@hooks/useUpdateModalStyle';

import { reqGroupEvent } from '@type/index';
import { useSelectedCalendarStore } from '@store/index';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  position: { x: number; y: number };
}

export default React.memo(function EventModal({
  isOpen,
  onClose,
  selectedDay,
  position,
}: EventModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const { SelectedCalendar } = useSelectedCalendarStore();

  useUpdateModalStyle({ position, setModalStyle });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value;

    if (!title) return alert('등록할 일정 제목을 작성해주세요.');
    if (!selectedDay) return alert('선택된 날이 없습니다.');

    const eventData: reqGroupEvent = {
      groupCalendarId: SelectedCalendar,
      title: title,
      startAt: format(selectedDay, 'yyyy-MM-dd'),
      endAt: format(selectedDay, 'yyyy-MM-dd'),
    };

    const res = await CALENDAR.createGroupEvent(eventData);
    if (res) {
      await CALENDAR.getGroupAllEvents(SelectedCalendar);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '24rem',
          height: '5rem',
          position: 'fixed',
          right: 'auto',
          bottom: 'auto',
          ...modalStyle,
        },
        overlay: {
          backgroundColor: 'rgba(255, 255, 255, 0)',
        },
      }}
    >
      <form onSubmit={handleSubmit} className="w-full px-3 flex justify-between items-center">
        <input
          className="INPUT w-5/6 p-1 mr-3 border rounded"
          type="text"
          placeholder="일정 제목"
          ref={titleRef}
        />
        <button className="h-fit text-lg hover:text-custom-main" type="submit">
          등록
        </button>
      </form>
    </Modal>
  );
});

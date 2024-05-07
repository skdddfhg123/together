import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';

import useUpdateModalStyle from '@hooks/useUpdateModalStyle';
import * as CALENDAR from '@services/calendarAPI';
import { reqGroupEventStore, useNowCalendarStore } from '@store/index';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  userCalendarId: string | null;
  position: { x: number; y: number };
}

export default React.memo(function EventModal({
  isOpen,
  onClose,
  selectedDay,
  userCalendarId,
  position,
}: EventModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const groupCalendarId = useNowCalendarStore((state) => state.nowCalendar);

  useUpdateModalStyle({ position, setModalStyle });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value;

    if (!title) return alert('등록할 일정 제목을 작성해주세요.');
    if (!selectedDay) return alert('선택된 날이 없습니다.');
    if (!groupCalendarId) return alert('그룹 리스트에서 일정을 등록할 그룹을 선택해주세요');
    if (!userCalendarId) return alert('새로고침 후 다시 시도해주세요.');

    const eventData: reqGroupEventStore = {
      groupCalendarId,
      title,
      author: userCalendarId,
      startAt: format(selectedDay, 'yyyy-MM-dd'),
      endAt: format(selectedDay, 'yyyy-MM-dd'),
    };

    const res = await CALENDAR.createGroupEvent(eventData);
    if (res) {
      await CALENDAR.getCalEvents(groupCalendarId);
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

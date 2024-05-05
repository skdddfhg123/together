import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';

import * as CALENDAR from '@services/calendarAPI';
import { reqGroupEvent, useNowCalendarStore } from '@store/index';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  userCalendarId: string | null;
  position: { x: number; y: number };
}

export default function EventModal({
  isOpen,
  onClose,
  selectedDay,
  userCalendarId,
  position,
}: EventModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [modalStyle, setModalStyle] = useState({});
  const groupCalendarId = useNowCalendarStore((state) => state.nowCalendar);

  useEffect(() => {
    const updateModalStyle = () => {
      const modalWidth = 384;
      const modalHeight = 80;
      const newX = Math.max(10, Math.min(position.x - 100, window.innerWidth - modalWidth - 10));
      const newY = Math.max(10, Math.min(position.y + 50, window.innerHeight - modalHeight - 10));

      setModalStyle({
        top: `${newY}px`,
        left: `${newX}px`,
      });
    };

    window.addEventListener('resize', updateModalStyle);
    updateModalStyle();

    return () => {
      window.removeEventListener('resize', updateModalStyle);
    };
  }, [position, window.innerWidth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(`일정 생성할 groupCalendarId`, groupCalendarId); //debug//
    const title = titleRef.current?.value;
    if (!title) return alert('등록할 일정 제목을 작성해주세요.');
    if (!selectedDay) return console.log('선택된 날이 없습니다.'); //debug//
    if (!groupCalendarId) return console.log('등록할 수 있는 그룹 캘린더 아이디가 없습니다.'); //debug//

    const eventData: reqGroupEvent = {
      groupCalendarId,
      title,
      author: userCalendarId || 'defaultUserId',
      startAt: format(selectedDay, 'yyyy-MM-dd'),
      endAt: format(selectedDay, 'yyyy-MM-dd'),
      emails: [] as string[],
      color: 'blue',
    };

    try {
      const res = await CALENDAR.createGroupEvent(eventData);
      console.log(`일정 등록 response`, res.data);
      await CALENDAR.getCalEvents(groupCalendarId);
      onClose();
      console.log('일정 등록 성공'); //debug//
    } catch (error) {
      alert('일정을 등록하지 못했습니다.');
      console.error('일정 등록 실패', error); //debug//
      onClose();
    }
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
      <form onSubmit={handleSubmit} className="w-full flex justify-between items-center p-3">
        <input
          className="w-5/6 p-1 mr-3 border rounded"
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
}

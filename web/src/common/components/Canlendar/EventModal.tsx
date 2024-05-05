import React, { useState, useEffect } from 'react';
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
  const [title, setTitle] = useState<string>('');
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

  const handleSubmit = async () => {
    if (!selectedDay || !groupCalendarId) {
      console.error('날짜 혹은 캘린더 아이디가 없습니다.');
      return;
    }

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
      setTitle('');
      console.log('일정 등록 성공'); //debug//
    } catch (error) {
      console.error('일정 등록 실패', error); //debug//
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
      <input
        className="w-5/6 p-1 mr-3 border rounded"
        type="text"
        placeholder="일정 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="h-fit text-lg hover:text-custom-main" onClick={handleSubmit}>
        등록
      </button>
    </Modal>
  );
}

import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import DayPickerComp from '@components/Canlendar/DayPickerComp';
import { format } from 'date-fns';
import { useSetDayStore } from '@store/index';

interface ScheduleModalProps {
  isOpen: boolean;
  onSave: (title: string) => void;
}

export default function ScheduleModal({ isOpen, onSave }: ScheduleModalProps) {
  const [title, setTitle] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalStyle, setModalStyle] = useState({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { selectedDay, setSelectedDay } = useSetDayStore((state) => ({
    selectedDay: state.selectedDay,
    setSelectedDay: state.setSelectedDay,
  }));

  const formatDate = (date: Date | null) => {
    return date ? format(date, 'PPP') : '';
  };

  const openModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalStyle({
        content: {
          top: `${rect.top - 100}px`,
          left: `${rect.left - 100}px`,
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(0%, -50%)',
        },
      });
    }
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  return (
    <div
      className={`relative flex flex-col overflow-hidden transition-all duration-500 ${isOpen ? 'w-80' : 'w-0'}`}
      id={isOpen ? 'slideIn-right' : 'slideOut-right'}
    >
      {isOpen && (
        <div className="w-80">
          <h2>일정 등록</h2>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button ref={buttonRef} onClick={openModal} className="get-date">
            선택된 날짜 : {selectedDay ? formatDate(selectedDay) : '날짜를 선택해 주세요'}
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Day Picker"
            style={modalStyle}
          >
            <DayPickerComp selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <button onClick={closeModal}>Close</button>
          </Modal>
          <button
            onClick={() => {
              onSave(title);
              setTitle('');
              setSelectedDay(null);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

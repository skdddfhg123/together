import React, { useState } from 'react';
import DayPickerComp from '@components/Canlendar/DayPickerComp';
import { format } from 'date-fns';
import { useSetDayStore } from '@store/index';
interface ScheduleModalProps {
  isOpen: boolean;
  onSave: (title: string) => void;
}

export default function ScheduleModal({ isOpen, onSave }: ScheduleModalProps) {
  const [title, setTitle] = useState<string>('');
  const [isDayPickerOpen, setIsDayPickerOpen] = useState<boolean>(false);
  const { selectedDay, setSelectedDay } = useSetDayStore((state) => ({
    selectedDay: state.selectedDay,
    setSelectedDay: state.setSelectedDay,
  }));

  const formatDate = (date: Date | null) => {
    return date ? format(date, 'PPP') : ''; // 'PPP' 예: Jan 1, 2020
  };

  const toggleDayPicker = () => {
    setIsDayPickerOpen(!isDayPickerOpen);
  };

  return (
    <div
      className={`relative flex flex-col overflow-hidden transition-all duration-500 
      ${isOpen ? 'w-80' : 'w-0'}`}
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
          <button className="get-date" onClick={toggleDayPicker}>
            선택된 날짜 : {selectedDay ? formatDate(selectedDay) : '날짜를 선택해 주세요'}
          </button>
          {isDayPickerOpen && (
            <div className="daypicker-modal">
              <DayPickerComp selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            </div>
          )}
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

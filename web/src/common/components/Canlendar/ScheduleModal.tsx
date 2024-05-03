// ScheduleModal.jsx
import React, { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onSave: (title: string) => void;
}

export default function ScheduleModal({ isOpen, onSave }: ScheduleModalProps) {
  const [title, setTitle] = useState<string>('');

  return (
    <div
      className={`relative flex flex-col overflow-hidden transition-all duration-500 
      ${isOpen ? 'w-80 ' : 'w-0'}`}
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
          <button
            onClick={() => {
              onSave(title);
              setTitle('');
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

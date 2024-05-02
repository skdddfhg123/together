// ScheduleModal.jsx
import React, { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onSave: (title: string) => void;
}

export default function ScheduleModal({ isOpen, onSave }: ScheduleModalProps) {
  const [title, setTitle] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div
      className="w-1/5 flex flex-col"
      id={isOpen ? 'slideRight-entering' : 'slideRight-exiting'}
    >
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
  );
}

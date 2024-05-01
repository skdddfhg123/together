// ScheduleModal.jsx
import React, { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
}: ScheduleModalProps) {
  const [title, setTitle] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Add Schedule Title</h2>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={() => {
            onSave(title);
            setTitle(''); // Clear title after saving
          }}
        >
          Save
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

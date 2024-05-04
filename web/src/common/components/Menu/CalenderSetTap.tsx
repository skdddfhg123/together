import React from 'react';

interface CalenderTapProps {
  onClose: () => void;
}

export default function CalenderSetTap({ onClose }: CalenderTapProps) {
  return (
    <div className={`flex flex-row justify-between`}>
      <div>CalendarSet</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

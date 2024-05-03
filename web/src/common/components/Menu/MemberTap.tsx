import React from 'react';

interface memberTapProps {
  onClose: () => void;
}

export default function memberTap({ onClose }: memberTapProps) {
  return (
    <div className={`flex flex-row justify-between`}>
      <div>Member</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

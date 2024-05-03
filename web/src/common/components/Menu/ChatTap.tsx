import React from 'react';

interface ChatTapProps {
  onClose: () => void;
}

export default function ChatTap({ onClose }: ChatTapProps) {
  return (
    <div className={`flex flex-row justify-between`}>
      <div>Chat</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

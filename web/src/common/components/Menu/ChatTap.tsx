import React from 'react';

interface ChatTapProps {
  onClose: () => void;
}

//TODO 채팅 로그 페이지네이션
export default function ChatTap({ onClose }: ChatTapProps) {
  return (
    <>
      <header className="rMenu-header">
        <h2>Chat</h2>
        <button className="BTN" onClick={onClose}>
          Close
        </button>
      </header>
    </>
  );
}

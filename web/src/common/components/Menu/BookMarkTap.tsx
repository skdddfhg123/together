import React from 'react';

interface BookmarpProps {
  onClose: () => void;
}

export default function BookMarkTap({ onClose }: BookmarpProps) {
  // TODO 캘린더와 그룹 캘린더에 모든 피드들을 모아볼 수 있는 곳, 캘린더 컴포넌트 위치에 피드 컴포넌트로 대체해야함
  // TODO 여기도 마찬가지로, 피드 모달 띄울 수 있어야 함
  return (
    <>
      <header className="rMenu-header">
        <h2>Bookmark</h2>
        <button className="BTN" onClick={onClose}>
          Close
        </button>
      </header>
    </>
  );
}

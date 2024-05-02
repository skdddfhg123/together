import React, { useState } from 'react';
import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/ChatTap';
import MemberTap from '@components/Menu/MemberTap';

import '@styles/RightMenuTap.css';

export default function RightMenuTap() {
  const [bookMarkOn, setBookMarkOn] = useState<boolean>(false);
  const [chatOn, setChatOn] = useState<boolean>(false);
  const [memberOn, setMemberOn] = useState<boolean>(false);

  // 각 탭의 활성화를 토글하는 함수를 정의합니다.
  const toggleTap = (tap: 'bookmark' | 'chat' | 'member') => {
    if (tap === 'bookmark') {
      setBookMarkOn(!bookMarkOn);
      setChatOn(false);
      setMemberOn(false);
    } else if (tap === 'chat') {
      setChatOn(!chatOn);
      setBookMarkOn(false);
      setMemberOn(false);
    } else if (tap === 'member') {
      setMemberOn(!memberOn);
      setBookMarkOn(false);
      setChatOn(false);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <button onClick={() => toggleTap('bookmark')}>Bookmark</button>
        <button onClick={() => toggleTap('chat')}>Chat</button>
        <button onClick={() => toggleTap('member')}>Member</button>
      </div>
      <section
        className={`section-container ${bookMarkOn || chatOn || memberOn ? 'section-open' : ''}`}
      >
        <div className={`${bookMarkOn ? 'slide-in' : 'slide-out '}`}>
          Bookmark
        </div>
        <div className={chatOn ? 'slide-in' : 'slide-out'}>Chat</div>
        <div className={memberOn ? 'slide-in' : 'slide-out'}>Member</div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/ChatTap';
import MemberTap from '@components/Menu/MemberTap';

// import '@styles/RightMenuTap.css';

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

  const closeTap = (tap: 'bookmark' | 'chat' | 'member') => {
    if (tap === 'bookmark') {
      setBookMarkOn(false);
    } else if (tap === 'chat') {
      setChatOn(false);
    } else if (tap === 'member') {
      setMemberOn(false);
    }
  };

  return (
    <div className="h-full flex flex-row border-l">
      <div className="flex flex-col">
        <button onClick={() => toggleTap('bookmark')}>Bookmark</button>
        <button onClick={() => toggleTap('chat')}>Chat</button>
        <button onClick={() => toggleTap('member')}>Member</button>
      </div>
      <section
        className={`relative flex flex-col overflow-hidden transition-all duration-500 
        ${bookMarkOn || chatOn || memberOn ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}
      >
        <div id={`${bookMarkOn ? 'slideIn-right' : 'slideOut-right '}`}>
          {bookMarkOn && <BookMarkTap onClose={() => closeTap('bookmark')} />}
        </div>
        <div id={chatOn ? 'slideIn-right' : 'slideOut-right '}>
          {chatOn && <ChatTap onClose={() => closeTap('chat')} />}
        </div>
        <div id={memberOn ? 'slideIn-right' : 'slideOut-right '}>
          {memberOn && <MemberTap onClose={() => closeTap('member')} />}
        </div>
      </section>
    </div>
  );
}

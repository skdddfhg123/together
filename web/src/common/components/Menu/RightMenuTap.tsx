import React, { useState } from 'react';
import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/ChatTap';
import MemberTap from '@components/Menu/MemberTap';
import CalendarSetTap from '@components/Menu/CalenderSetTap';

type TapName = 'bookmark' | 'chat' | 'member' | 'calendarSet';

export default React.memo(function RightMenuTap() {
  const [activeTap, setActiveTap] = useState<TapName | null>(null);

  const toggleTap = (tap: TapName) => {
    setActiveTap(activeTap === tap ? null : tap);
  };

  return (
    <div className="h-full flex flex-row border-l">
      <div className="flex flex-col">
        <button className={`py-4`} onClick={() => toggleTap('bookmark')}>
          Bookmark
        </button>
        <button className={`py-4`} onClick={() => toggleTap('chat')}>
          Chat
        </button>
        <button className={`py-4`} onClick={() => toggleTap('member')}>
          Member
        </button>
        <button className={`py-4`} onClick={() => toggleTap('calendarSet')}>
          CalendarSet
        </button>
      </div>
      <section
        className={`flex flex-col overflow-hidden transition-all duration-300 ${activeTap ? 'w-80' : 'w-0'}`}
      >
        <div id={`${activeTap === 'bookmark' ? 'slideIn-right' : 'slideOut-right'}`}>
          {activeTap === 'bookmark' && <BookMarkTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'chat' ? 'slideIn-right' : 'slideOut-right'}>
          {activeTap === 'chat' && <ChatTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'member' ? 'slideIn-right' : 'slideOut-right'}>
          {activeTap === 'member' && <MemberTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'calendarSet' ? 'slideIn-right' : 'slideOut-right'}>
          {activeTap === 'calendarSet' && <CalendarSetTap onClose={() => setActiveTap(null)} />}
        </div>
      </section>
    </div>
  );
});

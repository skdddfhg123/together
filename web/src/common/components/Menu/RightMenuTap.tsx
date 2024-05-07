import React, { useState, useEffect, useCallback } from 'react';
import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/ChatTap';
import MemberTap from '@components/Menu/MemberTap';
import CalendarSetTap from '@components/Menu/CalenderSetTap';
import { useNowCalendarStore } from '@store/index';

type TapName = 'bookmark' | 'chat' | 'member' | 'calendarSet';

export default React.memo(function RightMenuTap() {
  const { nowCalendar } = useNowCalendarStore();
  const [activeTap, setActiveTap] = useState<TapName | null>(null);

  useEffect(() => {
    setActiveTap(null);
  }, [nowCalendar]);

  const toggleTap = useCallback(
    (tap: TapName) => {
      setActiveTap(activeTap === tap ? null : tap);
    },
    [activeTap],
  );

  return (
    <div className="h-full flex flex-row border-l">
      <div className="flex flex-col">
        <button
          className={`${activeTap === 'bookmark' ? 'bg-custom-line' : ''} py-4`}
          onClick={() => toggleTap('bookmark')}
        >
          Bookmark
        </button>
        <button
          className={`${activeTap === 'chat' ? 'bg-custom-line' : ''} py-4`}
          onClick={() => toggleTap('chat')}
        >
          Chat
        </button>
        <button
          className={`${activeTap === 'member' ? 'bg-custom-line' : ''} py-4`}
          onClick={() => toggleTap('member')}
        >
          Member
        </button>
        <button
          disabled={nowCalendar === 'All'}
          className={`${
            activeTap === 'calendarSet' ? 'bg-custom-line' : ''
          } ${nowCalendar === 'All' ? 'text-gray-400 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (nowCalendar !== 'All') {
              toggleTap('calendarSet');
            }
          }}
        >
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

import React, { useState, useEffect, useCallback } from 'react';

import { useSelectedCalendarStore } from '@store/index';
import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/ChatTap';
import MemberTap from '@components/Menu/MemberTap';
import CalendarSetTap from '@components/Menu/CalenderSetTap';

type TapName = 'bookmark' | 'chat' | 'member' | 'calendarSet';

export default React.memo(function RightMenuTap() {
  const { SelectedCalendar } = useSelectedCalendarStore();
  const [activeTap, setActiveTap] = useState<TapName | null>(null);

  useEffect(() => {
    setActiveTap(null);
  }, [SelectedCalendar]);

  const toggleTap = useCallback(
    (tap: TapName) => {
      setActiveTap(activeTap === tap ? null : tap);
    },
    [activeTap],
  );

  return (
    <div className="FLEX-verC h-full border-l">
      <div className="FLEX-horiz">
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
          disabled={SelectedCalendar === 'All'}
          className={`${
            activeTap === 'calendarSet' ? 'bg-custom-line' : ''
          } ${SelectedCalendar === 'All' ? 'text-gray-400 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (SelectedCalendar !== 'All') {
              toggleTap('calendarSet');
            }
          }}
        >
          CalendarSet
        </button>
      </div>
      <section
        className={`FLEX-horiz overflow-hidden transition-all duration-300 ${activeTap ? 'w-80' : 'w-0'}`}
      >
        <div id={`${activeTap === 'bookmark' ? 'SLIDEin-right' : 'SLIDEout-right'}`}>
          {activeTap === 'bookmark' && <BookMarkTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'chat' ? 'SLIDEin-right' : 'SLIDEout-right'}>
          {activeTap === 'chat' && <ChatTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'member' ? 'SLIDEin-right' : 'SLIDEout-right'}>
          {activeTap === 'member' && <MemberTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'calendarSet' ? 'SLIDEin-right' : 'SLIDEout-right'}>
          {activeTap === 'calendarSet' && <CalendarSetTap onClose={() => setActiveTap(null)} />}
        </div>
      </section>
    </div>
  );
});

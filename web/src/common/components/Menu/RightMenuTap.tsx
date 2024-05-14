import React, { useState, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';

import { useSelectedCalendarStore } from '@store/index';

import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/Chat/ChatTap';
import MemberTap from '@components/Menu/MemberTap';
import CalendarSetTap from '@components/Menu/CalenderSetTap';

import optionImg from '@assets/r-optrion.png';
import chatImg from '@assets/r-chat.png';
import memberImg from '@assets/r-member.png';
import feedImg from '@assets/r-feed.png';

type TapName = 'bookmark' | 'chat' | 'member' | 'calendarSet';

export default React.memo(function RightMenuTap() {
  const { selectedCalendar } = useSelectedCalendarStore();
  const [activeTap, setActiveTap] = useState<TapName | null>(null);

  const toggleTap = useCallback(
    (tap: TapName) => {
      if (activeTap !== tap) {
        setActiveTap(tap);
      } else {
        setActiveTap(activeTap === tap ? null : tap);
      }
    },
    [activeTap],
  );

  return (
    <div className="FLEX-verC h-full border-l">
      <div className="FLEX-horiz space-y-3">
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`
                    FLEX-verC items-center h-16 w-16 hover:bg-custom-light rounded
                    ${
                      activeTap === 'bookmark' ? 'bg-custom-main rounded' : ''
                    } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => toggleTap('bookmark')}
        >
          <img className="w-12" src={feedImg} alt="피드 전체" />
        </button>
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`
                    FLEX-verC items-center h-16 w-16 hover:bg-custom-light rounded
                    ${
                      activeTap === 'chat' ? 'bg-custom-main rounded' : ''
                    } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => toggleTap('chat')}
        >
          <img className="w-12 mx-auto" src={chatImg} alt="채팅" />
        </button>
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`FLEX-verC items-center h-16 w-16 hover:bg-custom-light rounded
          ${
            activeTap === 'member' ? 'bg-custom-main rounded' : ''
          } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (selectedCalendar !== 'All') {
              toggleTap('member');
            }
          }}
        >
          <img className="w-16 mx-auto" src={memberImg} alt="멤버" />
        </button>
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`FLEX-verC items-center h-16 w-16 hover:bg-custom-light rounded
          ${
            activeTap === 'calendarSet' ? 'bg-custom-main rounded' : ''
          } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (selectedCalendar !== 'All') {
              toggleTap('calendarSet');
            }
          }}
        >
          <img className="w-12 mx-auto" src={optionImg} alt="캘린더 설정" />
        </button>
      </div>
      <section
        className={`FLEX-horiz overflow-hidden transition-all duration-300 ${activeTap ? 'w-96 border-l' : 'w-0'}`}
      >
        <div id={`${activeTap === 'bookmark' ? 'SLIDEin-right' : 'SLIDEout-right'}`}>
          {activeTap === 'bookmark' && <BookMarkTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'chat' ? 'SLIDEchatIn-right' : 'SLIDEchatOut-right'}>
          {activeTap === 'chat' && (
            <ChatTap selectedCalendar={selectedCalendar} onClose={() => setActiveTap(null)} />
          )}
        </div>
        <div id={activeTap === 'member' ? 'SLIDEin-right' : 'SLIDEout-right'}>
          {activeTap === 'member' && (
            <MemberTap selectedCalendar={selectedCalendar} onClose={() => setActiveTap(null)} />
          )}
        </div>
        <div id={activeTap === 'calendarSet' ? 'SLIDEin-right' : 'SLIDEout-right'}>
          {activeTap === 'calendarSet' && <CalendarSetTap onClose={() => setActiveTap(null)} />}
        </div>
      </section>
      <Tooltip id="tool-tip">
        <div>그룹 캘린더를 먼저 선택해주세요.</div>
      </Tooltip>
    </div>
  );
});

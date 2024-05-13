import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Socket, io } from 'socket.io-client';

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
  const navigate = useNavigate();
  const { selectedCalendar } = useSelectedCalendarStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeTap, setActiveTap] = useState<TapName | null>(null);

  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const token = getCookie('accessToken');

  useEffect(() => {
    if (activeTap === 'chat' && !socket) {
      const newSocket = io('http://15.164.174.224:5000', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSocket(newSocket);

      if (selectedCalendar === 'All') return alert('캘린더를 선택해주세요.');
      newSocket.on('connect', () => {
        console.log('Connected to chat server'); //debug//
        newSocket.emit('enterChatRoom', selectedCalendar.calendarId);
      });

      // newSocket.on('exception', (error) => {
      //   console.log(`채팅 Error`, error); //debug//
      // alert('로그인 세션이 만료되었습니다.');
      // navigate('/signin');
      // });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [activeTap, token, selectedCalendar]);

  useEffect(() => {
    setActiveTap(null);
  }, [selectedCalendar]);

  const toggleTap = useCallback((tap: TapName) => {
    setActiveTap(activeTap === tap ? null : tap);
  }, []);

  return (
    <div className="FLEX-verC h-full border-l">
      <div className="FLEX-horiz space-y-3">
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`
                    FLEX-verC items-center h-16 w-16 hover:bg-custom-light
                    ${
                      activeTap === 'calendarSet' ? 'bg-custom-line' : ''
                    } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => toggleTap('bookmark')}
        >
          <img className="w-12" src={feedImg} />
        </button>
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`
                    FLEX-verC items-center h-16 w-16 hover:bg-custom-light
                    ${
                      activeTap === 'calendarSet' ? 'bg-custom-line' : ''
                    } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => toggleTap('chat')}
        >
          <img className="w-12 mx-auto" src={chatImg} />
        </button>
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`FLEX-verC items-center h-16 w-16 hover:bg-custom-light
          ${
            activeTap === 'calendarSet' ? 'bg-custom-line' : ''
          } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (selectedCalendar !== 'All') {
              toggleTap('member');
            }
          }}
        >
          <img className="w-16 mx-auto" src={memberImg} />
        </button>
        <button
          {...(selectedCalendar === 'All' ? { 'data-tooltip-id': 'tool-tip' } : {})}
          disabled={selectedCalendar === 'All'}
          className={`FLEX-verC items-center h-16 w-16 hover:bg-custom-light
          ${
            activeTap === 'calendarSet' ? 'bg-custom-line' : ''
          } ${selectedCalendar === 'All' ? 'hover:bg-red-300 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (selectedCalendar !== 'All') {
              toggleTap('calendarSet');
            }
          }}
        >
          <img className="w-12 mx-auto" src={optionImg} />
        </button>
      </div>
      <section
        className={`FLEX-horiz overflow-hidden transition-all duration-300 ${activeTap ? 'w-96 border-l' : 'w-0'}`}
      >
        <div id={`${activeTap === 'bookmark' ? 'SLIDEin-right' : 'SLIDEout-right'}`}>
          {activeTap === 'bookmark' && <BookMarkTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'chat' ? 'SLIDEchatIn-right' : 'SLIDEchatOut-right'}>
          {activeTap === 'chat' && socket ? (
            <ChatTap
              selectedCalendar={selectedCalendar}
              socket={socket}
              onClose={() => setActiveTap(null)}
            />
          ) : null}
        </div>
        <div id={activeTap === 'member' ? 'SLIDEin-right' : 'SLIDEout-right'}>
          {activeTap === 'member' && <MemberTap onClose={() => setActiveTap(null)} />}
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

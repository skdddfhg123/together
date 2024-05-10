import React, { useState, useEffect, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

import { useSelectedCalendarStore } from '@store/index';
import BookMarkTap from '@components/Menu/BookMarkTap';
import ChatTap from '@components/Menu/Chat/ChatTap';
import MemberTap from '@components/Menu/MemberTap';
import CalendarSetTap from '@components/Menu/CalenderSetTap';

type TapName = 'bookmark' | 'chat' | 'member' | 'calendarSet';

export default React.memo(function RightMenuTap() {
  const navigate = useNavigate();
  const { SelectedCalendar } = useSelectedCalendarStore();
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

      newSocket.on('connect', () => {
        console.log('Connected to chat server'); //debug//
        newSocket.emit('enterChatRoom', SelectedCalendar);
      });

      newSocket.on('exception', (error) => {
        console.log(`채팅 Error`, error); //debug//
        alert('로그인 세션이 만료되었습니다.');
        navigate('/signin');
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [activeTap, token, SelectedCalendar]);

  useEffect(() => {
    setActiveTap(null);
  }, [SelectedCalendar]);

  const toggleTap = useCallback((tap: TapName) => {
    setActiveTap(activeTap === tap ? null : tap);
  }, []);

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
          disabled={SelectedCalendar === 'All'}
          className={`${
            activeTap === 'member' ? 'bg-custom-line' : ''
          } ${SelectedCalendar === 'All' ? 'text-gray-400 cursor-not-allowed' : ''} py-4`}
          onClick={() => {
            if (SelectedCalendar !== 'All') {
              toggleTap('member');
            }
          }}
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
        className={`FLEX-horiz overflow-hidden transition-all duration-300 ${activeTap ? 'w-96 border-l' : 'w-0'}`}
      >
        <div id={`${activeTap === 'bookmark' ? 'SLIDEin-right' : 'SLIDEout-right'}`}>
          {activeTap === 'bookmark' && <BookMarkTap onClose={() => setActiveTap(null)} />}
        </div>
        <div id={activeTap === 'chat' ? 'SLIDEchatIn-right' : 'SLIDEchatOut-right'}>
          {activeTap === 'chat' && socket ? (
            <ChatTap socket={socket} onClose={() => setActiveTap(null)} />
          ) : null}
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

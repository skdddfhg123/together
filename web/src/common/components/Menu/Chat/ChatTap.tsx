import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { format, parseISO } from 'date-fns';

import useToggle from '@hooks/useToggle';
import sendToast from '@hooks/sendToast';
import { useWebSocket } from '@utils/webSocket';
import { getCookie } from '@utils/cookie';
import * as CHAT from '@services/ChatAndEmojiAPI';
import { useUserInfoStore } from '@store/index';
import { Calendar, ChatList, Emoji, Image, Message } from '@type/index';

import CreateEmojiModal from '@components/Menu/Chat/CreateEmoji/CreateEmojiModal';

import default_user from '@assets/default_user.png';
import '@styles/modalStyle.css';
import '@styles/chat.css';

interface ChatTapProps {
  selectedCalendar: Calendar | 'All';
  onClose: () => void;
}
export default React.memo(function ChatTap({ selectedCalendar, onClose }: ChatTapProps) {
  const { userInfo } = useUserInfoStore();

  const { connectWebSocket, disconnectWebSocket, socket } = useWebSocket();
  const { isOn, toggle } = useToggle(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState<Image>('');
  const [imagePreview, setImagePreview] = useState<Image | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [EmojiList, setEmojiList] = useState<Emoji[]>([]);
  const msgRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLLIElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectImage = (emojiSrc: Image) => {
    setImagePreview(emojiSrc);
    setSelectEmoji(emojiSrc);
    closeModal();
  };

  const cancelEmoji = () => {
    setSelectEmoji('');
    setImagePreview('');
  };

  //********************? Chatting Socket
  useEffect(() => {
    const token = getCookie('accessToken');
    if (!token) {
      console.error('No access token found'); //debug//
      return;
    }

    connectWebSocket(token);

    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    const messageListener = (msg: Message) => {
      if (!msg.hasOwnProperty('registeredAt')) {
        msg = { ...msg, registeredAt: new Date().toISOString() };
      }

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, msg];
        newMessages.sort(
          (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime(),
        );
        return newMessages;
      });
    };

    if (selectedCalendar === 'All') {
      sendToast('default', '채팅을 연결할 그룹 캘린더를 선택해주세요.');
      return;
    }
    socket?.emit('enterChatRoom', selectedCalendar.calendarId);

    socket?.on('getMessage', messageListener);

    return () => {
      socket?.off('getMessage', messageListener);
    };
  }, [socket, selectedCalendar]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const msg = msgRef.current?.value;

    if ((msg && msg.trim()) || selectEmoji) {
      console.log(`emoji`, selectEmoji);
      const payload = {
        nickname: userInfo?.nickname,
        text: msg?.trim() ? msg : '',
        imageUrl: selectEmoji,
        registeredAt: new Date().toISOString(),
      };

      socket?.emit('sendCombinedMessage', payload);

      if (msgRef.current) {
        msgRef.current.value = '';
      }

      setSelectEmoji('');
      setImagePreview(null);
    }
  };

  const groupedMessages: ChatList = messages.reduce((acc: ChatList, msg: Message) => {
    const msgDate = format(parseISO(msg.registeredAt), 'yyyy-MM-dd');
    if (!acc[msgDate]) {
      acc[msgDate] = [];
    }
    acc[msgDate].push(msg);
    return acc;
  }, {});

  //*************************** 항상 마지막 채팅 보기
  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // **********************? 이모지 받아오기
  const fetchGroupEmoji = useCallback(async () => {
    try {
      if (selectedCalendar === 'All') {
        sendToast('default', '채팅을 연결할 그룹 캘린더를 선택해주세요.');
        return;
      }
      const res = await CHAT.fetchEmojiList(selectedCalendar.calendarId);
      setEmojiList(res);
    } catch (error) {
      console.error('이미지 받아오기 실패', error);
    }
  }, [selectedCalendar]);

  useEffect(() => {
    fetchGroupEmoji();
  }, [selectedCalendar, fetchGroupEmoji]);

  return (
    <div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-3xl text-black hover:text-gray-600"
        aria-label="Close"
      >
        &times;
      </button>
      {groupedMessages && Object.keys(groupedMessages).length > 0 ? (
        <ul className="overflow-container">
          {Object.keys(groupedMessages).map((date) => (
            <React.Fragment key={date}>
              <li className="date-label">{date}</li>
              {groupedMessages[date].map((msg, index) => {
                const isCurrentUser = userInfo && msg.nickname === userInfo.nickname;
                const attendee =
                  selectedCalendar !== 'All' &&
                  selectedCalendar.attendees.find((att) => att.nickname === msg.nickname);

                return (
                  <li className={`message-item ${isCurrentUser ? 'right' : 'left'}`} key={index}>
                    {!isCurrentUser && attendee && (
                      <img
                        className="attendee-thumbnail"
                        src={attendee.thumbnail || default_user}
                        alt={attendee.nickname}
                      />
                    )}
                    {!isCurrentUser && <strong className="nickname-left">{msg.nickname}</strong>}
                    <div className={`message-container ${isCurrentUser ? 'right' : 'left'}`}>
                      {isCurrentUser ? (
                        <>
                          <div className="content-container">
                            <div className={`message-content ${isCurrentUser ? 'right' : 'left'}`}>
                              {msg.message}
                              {msg.image && (
                                <img
                                  className="message-image"
                                  src={msg.image}
                                  alt="메세지 이미지"
                                />
                              )}
                            </div>
                            <p className="message-bubble"></p>
                          </div>
                          <div className={`timestamp ${isCurrentUser ? 'right' : 'left'}`}>
                            {format(parseISO(msg.registeredAt), 'HH:mm')}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="content-container">
                            <p className="message-bubble"></p>
                            <div className={`message-content ${isCurrentUser ? 'right' : 'left'}`}>
                              {msg.image && (
                                <img
                                  className="message-image"
                                  src={msg.image}
                                  alt="메세지 이미지"
                                />
                              )}
                              {msg.message}
                            </div>
                          </div>
                          <div className={`timestamp ${isCurrentUser ? 'right' : 'left'}`}>
                            {format(parseISO(msg.registeredAt), 'HH:mm')}
                          </div>
                        </>
                      )}
                    </div>
                    {isCurrentUser && <strong className="nickname-right">나</strong>}
                  </li>
                );
              })}
            </React.Fragment>
          ))}
          <li ref={messagesEndRef} />
        </ul>
      ) : (
        <>
          <div className="overflow-container">채팅 기록이 없습니다</div>
        </>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="이모지 선택"
        className="emojiModal"
        overlayClassName="emojiOverlay"
      >
        <div className="emoji-container">
          {EmojiList.map((emoji) => (
            <img
              className="emoji-item"
              key={emoji.emojiId}
              src={emoji.emojiUrl}
              alt={emoji.emojiName}
              onClick={() => handleSelectImage(emoji.emojiUrl)}
            />
          ))}
        </div>
        <div className="FLEX-verC space-x-4 mt-2">
          <button className="BTN rounded hover:bg-custom-light" onClick={closeModal}>
            닫기
          </button>
          <button className="BTN rounded hover:bg-custom-light" onClick={toggle}>
            이모지 만들기
          </button>
        </div>
      </Modal>
      <form onSubmit={sendMessage} className="form-container">
        {imagePreview && (
          <div
            className="image-preview transition-all duration-300 ease-in-out
            hover:object-contain hover:w-48 hover:h-48"
            onClick={cancelEmoji}
          >
            <img className="preview-image" src={imagePreview} alt="Preview" />
          </div>
        )}
        <button type="button" onClick={openModal} className="emoji-button">
          이모지
        </button>
        <input
          className="input-style"
          type="text"
          ref={msgRef}
          maxLength={100}
          placeholder="메세지를 입력해주세요"
        />
        <button type="submit" className="submit-button">
          전송
        </button>
      </form>
      <CreateEmojiModal isOpen={isOn} onClose={toggle} />
    </div>
  );
});

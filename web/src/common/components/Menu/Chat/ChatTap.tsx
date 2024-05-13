import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { Socket } from 'socket.io-client';
import useToggle from '@hooks/useToggle';

import { Calendar, Emoji, Image, Message } from '@type/index';
import * as CHAT from '@services/ChatAndEmojiAPI';

import CreateEmojiModal from '@components/Menu/Chat/CreateEmoji/CreateEmojiModal';

import '@styles/modalStyle.css';

interface ChatTapProps {
  selectedCalendar: Calendar | 'All';
  socket: Socket;
  onClose: () => void;
}
export default React.memo(function ChatTap({ selectedCalendar, socket, onClose }: ChatTapProps) {
  const { isOn, toggle } = useToggle(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState<Image>('');
  const [imagePreview, setImagePreview] = useState<Image | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [EmojiList, setEmojiList] = useState<Emoji[]>([]);
  const msgRef = useRef<HTMLInputElement>(null);

  const fetchGroupEmoji = useCallback(async () => {
    try {
      if (selectedCalendar === 'All') return alert('캘린더를 선택해주세요.');
      const res = await CHAT.fetchEmojiList(selectedCalendar.calendarId);
      setEmojiList(res);
    } catch (error) {
      console.error('이미지 받아오기 실패', error);
    }
  }, [selectedCalendar]);

  useEffect(() => {
    fetchGroupEmoji();
  }, [selectedCalendar]);

  useEffect(() => {
    const messageListener = (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log(`Received message`, msg);
    };

    socket.on('getMessage', messageListener);

    return () => {
      socket.off('getMessage', messageListener);
    };
  }, [socket]);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.focus();
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectImage = (emojiSrc: Image) => {
    setImagePreview(emojiSrc);
    setSelectEmoji(emojiSrc);
    closeModal();
  };

  const sendMessage = () => {
    const msg = msgRef.current?.value;

    if ((msg && msg.trim()) || selectEmoji) {
      console.log(`emoji`, selectEmoji);
      const payload = {
        text: msg?.trim() ? msg : '',
        imageUrl: selectEmoji,
      };

      socket.emit('sendCombinedMessage', payload);

      if (msgRef.current) {
        msgRef.current.value = '';
      }

      setSelectEmoji('');
      setImagePreview(null);
    }
  };

  return (
    <div className="FLEX-horizC chat-tap w-96 h-full">
      <button onClick={onClose}>채팅 닫기</button>
      <ul className="h-160 m-4">
        {messages.map((msg, index) => (
          <li className="flex" key={index}>
            <strong>{msg.nickname} : </strong>
            {msg.message}
            {msg.image && <img className="w-40 h-40 object-cover" src={msg.image} />}
          </li>
        ))}
      </ul>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="이모지 선택"
        className="emojiModal"
        overlayClassName="emojiOverlay"
      >
        <div className="SCROLL-hide flex flex-wrap w-full h-full space-x-2">
          {EmojiList.map((emoji: Emoji) => (
            <img
              className="w-20 h-20 m-0.5 object-cover"
              key={emoji.emojiId}
              src={emoji.emojiUrl}
              alt={emoji.emojiName}
              onClick={() => handleSelectImage(emoji.emojiUrl)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <div className="FLEX-verA">
          <button className="BTN hover:bg-custom-light rounded" onClick={closeModal}>
            닫기
          </button>
          <button className="BTN hover:bg-custom-light rounded" onClick={toggle}>
            이모지 만들기
          </button>
        </div>
      </Modal>
      {imagePreview && <img className="w-20 h-20 object-cover" src={imagePreview} alt="Preview" />}
      <section className="FLEX-verC w-full">
        <button onClick={openModal}>이모지</button>
        <input
          className="INPUT m-4 h-12 text-center"
          type="text"
          ref={msgRef}
          placeholder="메세지를 입력해주세요"
        />
        <button onClick={sendMessage}>전송</button>
      </section>
      <CreateEmojiModal isOpen={isOn} onClose={toggle} />
    </div>
  );
});

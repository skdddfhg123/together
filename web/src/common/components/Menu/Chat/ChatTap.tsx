import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { Socket } from 'socket.io-client';

import { Image, Message } from '@type/index';
import * as CHAT from '@services/ChatAPI';

import '@styles/modalStyle.css';

interface ChatTapProps {
  socket: Socket;
  onClose: () => void;
}
export default React.memo(function ChatTap({ socket, onClose }: ChatTapProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emoji, setEmoji] = useState<Image>('');
  const [imagePreview, setImagePreview] = useState<Image | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const msgRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await CHAT.getImages();
      setImages(res?.data);
    } catch (error) {
      console.error('이미지 받아오기 실패', error);
      setImages([]);
    }
  }, []);

  useEffect(() => {
    //TODO 이모지 로직 바꿔야함 -> 그룹 채팅방 별로
    if (emoji) return;
    // fetchImages();
  }, []);

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

  const handleSelectImage = (url: string) => {
    setImagePreview(url);
    setEmoji(url);
    closeModal();
  };

  const sendMessage = () => {
    const msg = msgRef.current?.value;

    if ((msg && msg.trim()) || emoji) {
      console.log(`emoji`, emoji);
      const payload = {
        text: msg?.trim() ? msg : '',
        imageUrl: emoji,
      };

      socket.emit('sendCombinedMessage', payload);

      if (msgRef.current) {
        msgRef.current.value = '';
      }

      setEmoji('');
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
        overlayClassName="Overlay"
      >
        <button onClick={closeModal}>닫기</button>
        <div className="SCROLL-hide flex flex-wrap w-full">
          {images.map((img, index) => (
            <img
              className="w-20 h-20 m-0.5 object-cover"
              key={index}
              src={img}
              alt={`Image ${index}`}
              onClick={() => handleSelectImage(img)}
              style={{ cursor: 'pointer' }}
            />
          ))}
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
    </div>
  );
});

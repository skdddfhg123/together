import React, { useState } from 'react';
import Modal from 'react-modal';

import { useSelectedCalendarStore } from '@store/index';
import TabEmojiUpload from '@components/Menu/Chat/CreateEmoji/TabEmojiUpload';
import TabEmojiList from '@components/Menu/Chat/CreateEmoji/TabEmojiList';

interface CreateEmojiProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEmojiModal({ isOpen, onClose }: CreateEmojiProps) {
  const { selectedCalendar } = useSelectedCalendarStore();
  const [tabIndex, setTabIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="이모지 선택"
        className="createEmojiModal"
        overlayClassName="createEmojiOverlay"
      >
        <div className="text-2xl font-bold text-black-500 mb-4">
          {tabIndex === 0 ? '그룹 이모지 업로드' : '그룹 이모지 리스트'}
        </div>
        <div className="FLEX-verC border-b border-gray-300 pb-3">
          <button
            onClick={() => setTabIndex(0)}
            className={`px-4 py-2 text-sm font-medium ${tabIndex === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            그룹 이모지 업로드
          </button>
          <button
            onClick={() => setTabIndex(1)}
            className={`px-4 py-2 text-sm font-medium ${tabIndex === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            그룹 이모지 리스트
          </button>
        </div>
        <div className="py-4">
          {tabIndex === 0 ? (
            <TabEmojiUpload selectedCalendar={selectedCalendar} onClose={onClose} />
          ) : (
            <TabEmojiList selectedCalendar={selectedCalendar} />
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-2 text-xl text-black hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
      </Modal>
    </>
  );
}

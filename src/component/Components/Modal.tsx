import React, { useState } from 'react';
import TabEmojiUpload from './TabEmojiUpload';
import TabEmojiList from './TabEmojiList';


const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg p-4 w-2/5 max-w-4xl h-auto">
        <div className="flex border-b border-gray-300 pb-3">
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
          {tabIndex === 0 ? <TabEmojiUpload /> : <TabEmojiList />}
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-2 text-xl text-black hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;

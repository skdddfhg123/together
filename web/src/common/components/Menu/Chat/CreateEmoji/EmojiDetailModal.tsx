import React from 'react';
import { UUID } from 'crypto';

import * as CHAT from '@services/ChatAndEmojiAPI';

interface EmojiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  emojiId: UUID;
  emoji: string;
  emojiName: string;
  uploadDate: string;
}

export default function EmojiDetailModal({
  isOpen,
  onClose,
  onDeleteSuccess,
  emojiId,
  emoji,
  emojiName,
  uploadDate,
}: EmojiDetailModalProps) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!window.confirm(`'${emojiName}'를 삭제하시겠습니까?`)) return;

    await CHAT.deleteGroupEmoji(emojiId);
    onDeleteSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white p-4 w-1/3 h-1/3 flex">
        <div className="flex-1 flex justify-center items-center">
          <img
            src={emoji}
            alt="Selected"
            style={{ width: '108px', height: '108px', objectFit: 'cover' }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-start p-4">
          <h2>이모지 이름 : {emojiName}</h2>
          <p> 등록 일시 : {uploadDate}</p>
          <button onClick={handleDelete} className="mt-2 bg-red-500 text-white p-2 rounded">
            삭제
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-2 text-2xl leading-none px-3 py-1 border-none text-black hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

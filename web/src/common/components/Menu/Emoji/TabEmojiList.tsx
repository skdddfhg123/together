import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import sendToast from '@hooks/useToast';
import * as EMOJI from '@services/ChatAndEmojiAPI';
import { Calendar, Emoji } from '@type/index';

import EmojiDetailModal from '@components/Menu/Emoji/EmojiDetailModal';

interface TabEmojiListProps {
  selectedCalendar: Calendar | 'All';
}

export default function TabEmojiList({ selectedCalendar }: TabEmojiListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const handleDeleteSuccess = () => {
    setEmojis(emojis.filter((emoji: Emoji) => emoji.emojiId !== selectedEmoji?.emojiId));
  };

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        if (selectedCalendar === 'All') return sendToast('default', '그룹 캘린더를 선택해주세요.');
        const res = await EMOJI.fetchEmojiList(selectedCalendar.calendarId);
        if (!res) throw new Error(`그룹 이모지 받아오기 실패`, res);
        setEmojis(
          res.map((emoji: Emoji) => ({
            emojiId: emoji.emojiId,
            emojiUrl: emoji.emojiUrl,
            emojiName: emoji.emojiName,
            createdAt: format(new Date(emoji.createdAt), 'yyyy-MM-dd HH:mm:ss'), // 날짜 형식 조정
          })),
        );
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchEmojis();
  }, [selectedCalendar]);

  const handleImageClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setModalOpen(true);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {emojis.map((emoji, index) => (
        <div
          key={emoji.emojiId}
          className="w-27 h-27 bg-gray-200 cursor-pointer flex justify-center items-center"
          onClick={() => handleImageClick(emoji)}
        >
          <img
            src={emoji.emojiUrl}
            alt={`Emoji ${index}`}
            title={emoji.emojiName}
            style={{ width: '108px', height: '108px', objectFit: 'cover' }}
          />
        </div>
      ))}
      {modalOpen && selectedEmoji && (
        <EmojiDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onDeleteSuccess={handleDeleteSuccess}
          emojiId={selectedEmoji.emojiId}
          emoji={selectedEmoji.emojiUrl}
          emojiName={selectedEmoji.emojiName}
          uploadDate={selectedEmoji.createdAt}
        />
      )}
    </div>
  );
}

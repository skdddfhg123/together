import React, { useEffect, useState } from 'react';
import EmojiDetailModal from './EmojiDetailModal';
import { format } from 'date-fns';

interface Emoji {
    id: string;
    src: string;
    name: string;
    date: string;
  }

const TabEmojiList: React.FC = ( ) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const handleDeleteSuccess = () => {
    setEmojis(emojis.filter(emoji => emoji.id !== selectedEmoji?.id));
  };

  useEffect(() => {
    const calendarId = 'e2f247e8-371b-4d65-b601-b405641d943e'; // 적절한 캘린더 ID 설정
    const fetchEmojis = async () => {
      try {
        const response = await fetch(`http://localhost:3000/emoji/get/${calendarId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setEmojis(data.map((emoji: any) => ({
            id: emoji.emojiId,
            src: emoji.emojiUrl,
            name: emoji.emojiName,
            date: format(new Date(emoji.createdAt), 'yyyy-MM-dd HH:mm:ss'), // 날짜 형식 조정

        })));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchEmojis();
  }, []);


  const handleImageClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setModalOpen(true);
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
    {emojis.map((emoji, index) => (
    <div key={emoji.id} className="w-27 h-27 bg-gray-200 cursor-pointer flex justify-center items-center" onClick={() => handleImageClick(emoji)}>
      <img src={emoji.src} alt={`Emoji ${index}`} title={emoji.name} style={{ width: '108px', height: '108px', objectFit: 'cover' }} />
    </div>
      ))}
      {modalOpen && selectedEmoji && <EmojiDetailModal 
      isOpen={modalOpen} 
      onClose={() => setModalOpen(false)}
      onDeleteSuccess={handleDeleteSuccess} 
      emojiId={selectedEmoji.id} 
      emoji={selectedEmoji.src} 
      emojiName={selectedEmoji.name} 
      uploadDate={selectedEmoji.date} />}
    </div>
  );
};

export default TabEmojiList;

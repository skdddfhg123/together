import React from 'react';

interface EmojiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void; // 삭제 성공 시 호출할 콜백
  emojiId: string;
  emoji: string;
  emojiName: string;
  uploadDate: string;
}

const EmojiDetailModal: React.FC<EmojiDetailModalProps> = ({
  isOpen,
  onClose,
  onDeleteSuccess,
  emojiId,
  emoji,
  emojiName,
  uploadDate,
}) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    if (window.confirm(`'${emojiName}'를 삭제하시겠습니까?`)) {
      try {
        const response = await fetch(`http://localhost:3000/emoji/remove/${emojiId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${yourJwtToken}`,  // JWT 토큰 설정 필요
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json(); // 서버 응답 내용을 로그로 출력
          console.error('Server response:', errorResponse);
          throw new Error(`Emoji 삭제 실패: ${errorResponse.message}`);
        }

        alert('Emoji가 성공적으로 삭제되었습니다.');
        onDeleteSuccess(); // 삭제 성공 콜백 호출
        onClose(); // 모달 닫기
      } catch (error) {
        console.error('Emoji 삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
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
};

export default EmojiDetailModal;

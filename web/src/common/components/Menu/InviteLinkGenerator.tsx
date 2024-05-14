import React, { useState } from 'react';
import { useSelectedCalendarStore } from '@store/index';
import useToggle from '@hooks/useToggle';

export default function InviteLinkGenerator() {
  const { isOn, toggle } = useToggle(false);
  const [inviteLink, setInviteLink] = useState('');
  const { selectedCalendar } = useSelectedCalendarStore();

  const handleGenerateLink = () => {
    if (selectedCalendar === 'All') return alert('그룹 캘린더를 선택해주세요.');
    const link = `${window.location.origin}/invite?invite=${selectedCalendar.calendarId}`;
    setInviteLink(link);
    toggle();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(
      () => {
        alert('링크가 복사되었습니다.');
      },
      () => {
        alert('복사 실패. 다시 시도해주세요.');
      },
    );
  };

  const handleKakaoShare = () => {
    if (selectedCalendar === 'All') return alert('그룹 캘린더를 선택해주세요.');
    const link = `${window.location.origin}/invite?invite=${selectedCalendar.calendarId}`;

    if (window.Kakao) {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(process.env.REACT_APP_KAKAO_CLIENT_JS as string);
      }

      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: 'Toogether',
          description: '초대 링크',
          imageUrl:
            'https://jungle-toogether.s3.amazonaws.com/feeds/6ebd2b9b-e483-4cb4-a376-8bf0a6c5308f.jpg',
          link: {
            mobileWebUrl: process.env.REACT_APP_HOST_URL as string,
            webUrl: link,
          },
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        className="m-4 p-4 bg-blue-500 text-white hover:bg-blue-700 rounded"
        onClick={handleGenerateLink}
      >
        Generate Invite Link
      </button>
      {isOn && (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-lg font-semibold">초대 링크</p>
          <div className="flex items-center space-x-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-500 bg-gray-100 border border-gray-300 rounded"
              href={inviteLink}
            >
              {inviteLink}
            </a>
          </div>
          <div className="FLEX-verC items-center w-full space-x-4">
            <button
              className="py-1 px-2 bg-green-500 text-white hover:bg-green-700 rounded"
              onClick={handleCopyLink}
            >
              Copy
            </button>
            <button id="kakaotalk-sharing-btn" onClick={handleKakaoShare}>
              <img
                className="w-12"
                src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                alt="Kakao Share"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

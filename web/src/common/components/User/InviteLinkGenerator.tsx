import React, { useState } from 'react';

import { useSelectedCalendarStore } from '@store/index';

export default function InviteLinkGenerator() {
  const [inviteLink, setInviteLink] = useState('');
  const { selectedCalendar } = useSelectedCalendarStore();

  // TODO CALENDAR ID를 직접 입력하지 않고 해쉬화 등 암호화 필요
  const handleGenerateLink = () => {
    // const inviteCode = Math.random().toString(36).substring(2, 15); // 간단한 랜덤 코드 생성
    if (selectedCalendar === 'All') return alert('그룹 캘린더를 선택해주세요.');
    const link = `${window.location.origin}/invite?invite=${selectedCalendar.calendarId}`;
    setInviteLink(link);
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
            mobileWebUrl: 'http://localhost:3000',
            webUrl: link,
          },
        },
      });
    }
  };

  return (
    <div className="FLEX-horizC">
      <button className="m-12 p-4 hover:bg-custom-light rounded" onClick={handleGenerateLink}>
        Generate Invite Link
      </button>
      {inviteLink && (
        <div className="FLEX-horizC">
          <p>초대 링크</p>
          <a
            // href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 w-5/6 bg-custom-line rounded"
          >
            {inviteLink}
          </a>
          <button id="kakaotalk-sharing-btn" onClick={handleKakaoShare}>
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"></img>
          </button>
        </div>
      )}
    </div>
  );
}

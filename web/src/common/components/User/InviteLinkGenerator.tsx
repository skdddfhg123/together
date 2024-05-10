import { useSelectedCalendarStore } from '@store/index';
import React, { useState } from 'react';

export default function InviteLinkGenerator() {
  const [inviteLink, setInviteLink] = useState('');
  const { SelectedCalendar } = useSelectedCalendarStore();

  // TODO CALENDAR ID를 직접 입력하지 않고 해쉬화 등 암호화 필요
  const handleGenerateLink = () => {
    // const inviteCode = Math.random().toString(36).substring(2, 15); // 간단한 랜덤 코드 생성
    const link = `${window.location.origin}/invite?invite=${SelectedCalendar}`;
    setInviteLink(link);
  };

  return (
    <div className="FLEX-horizC">
      <button className="mx-auto p-2 hover:bg-custom-light rounded" onClick={handleGenerateLink}>
        초대코드 만들기
      </button>
      {inviteLink && (
        <div className="FLEX-horizC">
          <p>초대 링크</p>
          <a
            href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 w-5/6 bg-custom-line rounded"
          >
            {inviteLink}
          </a>
        </div>
      )}
    </div>
  );
}

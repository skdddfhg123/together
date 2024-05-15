import React, { useState, useCallback } from 'react';

import sendToast from '@hooks/useToast';
import * as KAKAO from '@services/KakaoAPI';
import * as CALENDAR from '@services/calendarAPI';
import * as REDIS from '@services/redisAPI';
import { useSelectedCalendarStore } from '@store/index';

import syncImg from '@assets/sync.png';

export default function SyncSocialEvent() {
  const { selectedCalendar } = useSelectedCalendarStore();
  const [canInvoke, setCanInvoke] = useState(true);

  const getSocialEvents = useCallback(async () => {
    if (!canInvoke) {
      sendToast('error', '동기화는 3분에 1번만 가능합니다');
      return;
    }

    setCanInvoke(false);
    setTimeout(
      () => {
        setCanInvoke(true);
      },
      3 * 60 * 1000,
    );

    // ***************TODO 구글 및 outlook API 등록 필요
    const kakaoRes = await KAKAO.GetEvents();
    if (!kakaoRes) return;
    // const googleRes = await GOOGLE.GetEvents();
    // if (!googleRes) return;
    // const outlookRes = await OUTLOOK.GetEvents();
    // if (!outlookRes) return;

    sendToast('success', '동기화가 완료되었습니다.');
    await CALENDAR.getMyAllCalendar();
    await REDIS.MessagePost({ selectedCalendar: selectedCalendar, method: `일정을 등록` });
  }, [selectedCalendar, canInvoke]);

  return (
    <>
      <img
        className="w-14 h-14 mx-auto bg-custom-light rounded-3xl hover:cursor-pointer hover:bg-custom-yellow"
        id="sync-button"
        src={syncImg}
        alt="syncCalendar-button"
        onClick={getSocialEvents}
      />
    </>
  );
}

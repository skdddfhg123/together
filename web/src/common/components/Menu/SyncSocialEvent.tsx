import React, { useState, useCallback } from 'react';

import useToast from '@hooks/useToast';
import * as KAKAO from '@services/KakaoAPI';
import * as CALENDAR from '@services/calendarAPI';
import * as REDIS from '@services/redisAPI';
import * as USER from '@services/userAPI';
import * as GOOGLE from '@services/googleAPI';
import { useSelectedCalendarStore, useSocialEventListStore } from '@store/index';

import syncImg from '@assets/sync.png';
import { AllEvent, GoogleEvent } from '@type/index';

export default function SyncSocialEvent() {
  const { selectedCalendar } = useSelectedCalendarStore();
  const { setSocialEventList } = useSocialEventListStore();
  const [canInvoke, setCanInvoke] = useState(true);

  const getSocialEvents = useCallback(async () => {
    // if (!canInvoke) {
    //   useToast('error', '동기화는 3분에 1번만 가능합니다');
    //   return;
    // }

    // setCanInvoke(false);
    // setTimeout(
    //   () => {
    //     setCanInvoke(true);
    //   },
    //   3 * 60 * 1000,
    // );

    try {
      let socialEvents: AllEvent[] = [];

      const kakaoRes = await KAKAO.GetEvents();
      if (kakaoRes && kakaoRes.resultArray) {
        const kakaoEvents = kakaoRes.resultArray.map((event: KakaoEvent) => ({
          // id: event.socialEventId,
          startAt: event.startAt,
          endAt: event.endAt,
          social: event.social,
          title: event.title,
        }));
        socialEvents = [...socialEvents, ...kakaoEvents];
      }

      const googleRes = await GOOGLE.getEvents();
      console.log(`구글 이벤트`, googleRes);
      if (googleRes && googleRes.data) {
        const googleEvents = googleRes.data
          .filter((event: GoogleEvent) => event !== null)
          .map((event: GoogleEvent) => ({
            // id: event.socialEventId,
            startAt: event.startAt,
            endAt: event.endAt,
            social: 'google',
            title: event.title,
          }));
        socialEvents = [...socialEvents, ...googleEvents];
      }

      useToast('success', '동기화가 완료되었습니다.');
      setSocialEventList(socialEvents);

      await REDIS.MessagePost({ selectedCalendar: selectedCalendar, method: '동기화' });
    } catch (error) {
      useToast('error', '동기화 중 오류가 발생했습니다.');
      console.error(error);
    }
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

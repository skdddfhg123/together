import React, { useState, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';

import useToast from '@hooks/useToast';
import * as KAKAO from '@services/KakaoAPI';
import * as REDIS from '@services/redisAPI';
import * as GOOGLE from '@services/googleAPI';
import * as AZURE from '@services/azureAPI';
import { useSelectedCalendarStore, useSocialEventListStore } from '@store/index';

import syncImg from '@assets/sync.png';
import { AllEvent, socialEvent } from '@type/index';

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
      if (kakaoRes?.resultArray) {
        const kakaoEvents = kakaoRes.resultArray.map((event: KakaoEvent) => ({
          // id: event.socialEventId,
          startAt: event.startAt,
          endAt: event.endAt,
          social: event.social,
          title: event.title,
        }));
        socialEvents = [...socialEvents, ...kakaoEvents];
      } else return;

      const googleRes = await GOOGLE.getEvents();
      console.log(`google 일정`, googleRes);
      if (googleRes?.data) {
        const googleEvents = googleRes.data
          .filter((event: socialEvent) => event !== null)
          .map((event: socialEvent) => ({
            // id: event.socialEventId,
            startAt: event.startAt,
            endAt: event.endAt,
            social: 'google',
            title: event.title,
          }));
        socialEvents = [...socialEvents, ...googleEvents];
      } else return;

      // const azureRes = await AZURE.getEvents();
      // console.log(`Outlook 일정`, azureRes);
      // if (azureRes?.data) {
      //   const azureEvents = azureRes.data
      //     .filter((event: socialEvent) => event !== null)
      //     .map((event: socialEvent) => ({
      //       // id: event.socialEventId,
      //       startAt: event.startAt,
      //       endAt: event.endAt,
      //       social: 'outlook',
      //       title: event.title,
      //     }));
      //   socialEvents = [...socialEvents, ...azureEvents];
      // } else return;

      setSocialEventList(socialEvents);
    } catch (error) {
      useToast('error', '동기화 중 오류가 발생했습니다.');
      console.error(error);
      return;
    }

    await REDIS.MessagePost({ method: '동기화' });
    useToast('success', '동기화가 완료되었습니다.');
  }, [selectedCalendar, canInvoke]);

  return (
    <>
      <img
        data-tooltip-id="tooltip-sync"
        data-tooltip-place="left"
        className="w-14 h-14 mx-auto bg-custom-light rounded-3xl hover:cursor-pointer hover:bg-custom-yellow"
        id="sync-button"
        src={syncImg}
        alt="syncCalendar-button"
        onClick={getSocialEvents}
      />
      <Tooltip id="tooltip-sync" style={{ padding: '1rem', fontSize: '3rem' }}>
        <div>소셜 일정 동기화</div>
      </Tooltip>
    </>
  );
}

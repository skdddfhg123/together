import { AxiosError } from 'axios';
import * as redisAxios from '@utils/redis';
import { Calendar, Member } from '@type/index';
import { useCalendarListStore, useUserInfoStore } from '@store/index';

interface RedisSubscribe {
  channel: string; // 받는 사람 email
}

interface RedisPublish {
  selectedCalendar: Calendar | 'All';
  method: string;
}

export async function MessagePost({ selectedCalendar, method }: RedisPublish) {
  const userInfo = useUserInfoStore.getState().userInfo;
  const CalendarList = useCalendarListStore.getState().calendarList;
  const memberSet = new Set<Member>();

  for (const calendar of CalendarList) {
    for (const member of calendar.attendees) {
      if (
        !Array.from(memberSet).some(
          (existingMember) => existingMember.useremail === member.useremail,
        )
      ) {
        memberSet.add(member);
      }
    }
  }

  const memberList = Array.from(memberSet).filter(
    (member) => member.useremail !== userInfo?.useremail,
  );

  try {
    for (const member of memberList) {
      const message = `
        <div style="font-family: 'Jua', sans-serif;">
          <span style="font-size: 1.8rem; color: #7AFF79;">${userInfo?.nickname}</span>님이 
          <span style="font-size: 1.8rem; color: #F1B2DC;">${method}</span>하셨습니다.
        </div>`;

      const res = await redisAxios.post('/publish', {
        channel: member.useremail,
        message,
      });

      if (!res) throw new Error('Redis 메세지 전송 실패');
      console.log(`Redis 메세지 전송 성공 :`, res);
    }

    return true;
  } catch (e) {
    const err = e as AxiosError;
    console.error('Redis 메세지 전송 에러', err);
  }
}

export async function Connect(useremail: string) {
  try {
    const res = await redisAxios.get(`/subscribe/${useremail}`);
    if (!res) throw new Error('Redis 구독 실패');
    console.log(`Redis 구독 성공 :`, res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    console.error('Redis 구독 에러', err);
  }
}

export async function Unconnect(channel: RedisSubscribe) {
  try {
    const res = await redisAxios.get(`/unsubscribe/${channel}`);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    console.error('Redis 구독 취소 에러', err);
  }
}

// const handleSet = async () => {
//   try {
//     const response = await axios.post('/set', {
//       key,
//       value,
//       ttl: parseInt(ttl, 10),
//     });
//     setResult(`Key ${key} set with value ${value}`);
//   } catch (error) {
//     setResult(`Error: ${(error as AxiosError).response?.data}`); // 수정
//   }
// };

// const handleGet = async () => {
//   try {
//     const response = await axios.get(`/get/${key}`);
//     setResult(`Value for key ${key}: ${response.data}`);
//   } catch (error) {
//     setResult(`Error: ${(error as AxiosError).response?.data}`); // 수정
//   }
// };

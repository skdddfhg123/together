import { AxiosError, AxiosResponse } from 'axios';

import useToast from '@hooks/useToast';
import * as API from '@utils/api';
import * as REDIS from '@services/redisAPI';
import { Cookie, setCookie, deleteCookie } from '@utils/cookie';

import { AllEvent, Calendar, SignInForm, SignUpForm } from '@type/index';
import {
  useAllEventListStore,
  useSelectedCalendarStore,
  useSocialEventListStore,
  useUserInfoStore,
} from '@store/index';

// export async function firstRenderV1() {
//   try {
//     console.log(`%c 랜더링 시작 ...`, 'font-size: 20px; font-weight: 700; color: #badfff');
//     const start = performance.now();
//     const response = await API.get(`/calendar/get_calendar/v2`);
//     const calendarList = response.data;
//     const fetchCalendarEvents = async () => {
//       for (const calendar of calendarList) {
//         await API.get(`/calendar/group/get/v2/${calendar.calendarId}`);
//         await API.get(`/auth/all/getcalendar/V2/${calendar.calendarId}`);
//       }
//     };
//     await fetchCalendarEvents();
//     const end = performance.now();
//     console.log(
//       `%c 랜더링 끝. 소요 시간: ${Math.round(end - start)}ms`,
//       'font-size: 20px; font-weight: 700; color: #C62D42',
//     );

//     console.log(`%c 최적화 랜더링 시작 ...`, 'font-size: 20px; font-weight: 700; color: #efef7f');
//     const start2 = performance.now();
//     await API.get(`/auth/all/v2`);
//     const end2 = performance.now();
//     console.log(
//       `%c 최적화 랜더링 끝. 소요 시간: ${Math.round(end2 - start2)}ms`,
//       'font-size: 20px; font-weight: 700; color: #badfff',
//     );
//   } catch (error) {
//     console.error('Error during firstRender:', error);
//   }
// }

export async function firstRender() {
  try {
    const { data: res } = await API.get(`/auth/all/v2`);
    if (!res) throw new Error('USER - firstRender (유저 정보 db 조회 실패)');
    console.log(`USER - firstRender 성공`, res); //debug//

    useUserInfoStore.getState().setUserInfo(res.user);
    useSelectedCalendarStore.getState().setSelectedCalendar('All');

    REDIS.Connect();

    const events: AllEvent[] = res.events.map((event: AllEvent) => ({
      ...event,
      startAt: new Date(event.startAt),
      endAt: new Date(event.endAt),
    }));

    const AllEvents: AllEvent[] = events.filter((event: AllEvent) => event.group !== undefined);
    const SocialEvents: AllEvent[] = events.filter((event: AllEvent) => event.social !== undefined);

    useSocialEventListStore.getState().setSocialEventList(SocialEvents);
    useAllEventListStore.getState().setAllEventList(AllEvents);

    return true;
  } catch (e) {
    const err = e as AxiosError;
    console.log(`최초 렌더링 에러 `, err); //debug//
  }
}

export async function signUp(formData: SignUpForm) {
  try {
    const { useremail, nickname, password } = formData;

    const res = await API.post(`/auth/signup`, {
      useremail,
      nickname,
      password,
    });
    if (!res) throw new Error('가입 실패');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error('회원가입 에러', data); //debug//
      useToast('error', data.message);
    }
  }
}

export async function logIn(formData: SignInForm) {
  try {
    const { useremail, password } = formData;

    const res = await API.post(`/auth/login`, {
      useremail,
      password,
    });
    if (!res) throw new Error('로그인 실패');
    /*
    TODO accessToken 어떻게 할까
    access 토큰 유효시간을 백엔드에서 발급한 refresh 토큰과 동일하게 설정, 이후 만료된 access 토큰을 http header 담아서 보내면 refresh 시간 내에는 백엔드에서 자동 발급 
    따라서, 로그아웃을 수동으로 할 경우 백엔드에 저장된 refresh 토큰을 삭제하는 요청을 보낼 필요가 있음
    위의 경우, 백엔드에서 DB의 부하가 커질 수 있어 refresh 토큰을 프론트에서 쿠키에 저장해두고 access 토큰이 만료되면 http 헤더에 access 대신 refresh 토큰을 보내고, 
    백엔드가 refresh 토큰을 받았을 떄는 토큰이 유효한지 확인한 뒤에 access 토큰을 새로 발급해서 보내주는 것이 좋지 않나? 
    */

    //TODO 개발 단계에서 1시간 너무 짧아서 3일로 잠시 변경
    const accessToken: Cookie = {
      name: 'accessToken',
      value: res.data.accessToken,
      options: {
        path: '/',
        maxAge: 259200, // 3일
        secure: true,
        sameSite: 'none',
      },
    };

    // const refreshToken: Cookie = {
    //   name: 'refreshToken',
    //   value: res.data.refreshToken,
    //   options: {
    //     path: '/',
    //     maxAge: 5184000,
    //     secure: true,
    //     sameSite: 'none',
    //   },
    // };

    setCookie(accessToken);
    sessionStorage.setItem('accessToken', res.data.accessToken);
    // setCookie(refreshToken);

    return true;
  } catch (e) {
    const err = e as AxiosError;
    console.log(`로그인 에러 핸들러`, err);
  }
}

export async function logOut() {
  deleteCookie('accessToken');
  useToast('error', '로그아웃 되었습니다.');
}

export async function joinCalendar(calendarId: string) {
  try {
    const { data: res } = await API.patch(`/calendar/participate/${calendarId}`);
    if (!res) throw new Error('USER - joinCalendar (DB에서 그룹 캘린터 가입 실패)');
    console.log(`USER - joinCalendar 성공`, res); //debug//
    useToast('success', `캘린더 가입에 성공했습니다.`);

    return true;
  } catch (e) {
    const err = e as AxiosError;
    console.log('캘린더 가입 에러', err); //debug//
    useToast('warning', '캘린더 가입에 실패했습니다.');
  }
}

export async function updateThumbnail(thumbnailFormData: FormData) {
  try {
    const { data: res } = await API.post('/auth/update/thumbnail', thumbnailFormData);
    if (!res) throw new Error('USER - joinCalendar (DB에서 그룹 캘린터 가입 실패)');
    console.log(`USER - updateThumbnail 성공`, res); //debug//

    useToast('success', `프로필이 수정되었습니다.`);

    return true;
  } catch (e) {
    const err = e as AxiosError;
    console.error('USER - updateThumbnail 실패', err); //debug//
    useToast('warning', '프로필 업데이트에 실패했습니다.');
  }
}

export async function tutorial() {
  try {
    await API.get(`/auth/tutorial`);
  } catch (e) {
    const err = e as AxiosError;
    console.error('USER - tutorial 값 갱신 실패', err); //debug//
  }
}

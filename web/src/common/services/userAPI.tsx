import { AxiosError } from 'axios';
import * as API from '@utils/api';
import { setCookie } from '@utils/cookie';

import { Cookie, SignInForm, SignUpForm } from '@type/index';
import {
  useGroupEventListStore,
  useSelectedCalendarStore,
  useSocialEventListStore,
  useUserInfoStore,
} from '@store/index';

import { GroupEvent } from '@type/index';

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
      alert(data.message);
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
    // setCookie(refreshToken);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error('로그인 에러', data); //debug//
      alert(data.message);
    }
  }
}

export async function logOut() {
  sessionStorage.removeItem('accessToken');
  alert('로그아웃 되었습니다.');
}

// TODO auth/all/v2 로 업그레이드 예정
export async function firstRender() {
  try {
    const {
      data: [db_user],
    } = await API.get(`/auth/all`);
    if (!db_user) throw new Error('USER - firstRender (유저 정보 db 조회 실패)');
    console.log(`USER - firstRender 성공`, db_user); //debug//

    useUserInfoStore.getState().setUserInfo(db_user);
    useSelectedCalendarStore.getState().setSelectedCalendar('All');
    useSocialEventListStore.getState().setSocialEvents(db_user.userCalendarId.socialEvents);

    const allGroupEvents: GroupEvent[] = [];

    for (const calendar of db_user.userCalendarId.groupCalendar) {
      const updatedEvents = calendar.groupEvents.map((event: GroupEvent) => ({
        ...event,
        groupCalendarId: calendar.CalendarId,
        groupCalendarTitle: calendar.title,
      }));

      allGroupEvents.push(...updatedEvents);
    }
    useGroupEventListStore.getState().setGroupEvents(allGroupEvents);

    return true;
  } catch (e) {
    const err = e as AxiosError;
    if (err.response?.status === 400) {
      console.error('USER - firstRender 실패 : ', err.response);
      alert('토큰 정보가 일치하지 않습니다');
    } else if (err.response?.data) {
      const data = err.response.data as API.ErrorResponse;
      console.error('USER - firstRender 실패 2 : ', data); //debug//
      alert(data.message);
    } else {
      console.error('USER - firstRender 실패 3 : ', err);
    }
  }
}

export async function joinCalendar(calendarId: string) {
  try {
    const { data: res } = await API.patch(`/calendar/participate/${calendarId}`);
    if (!res) throw new Error('USER - joinCalendar (DB에서 그룹 캘린터 가입 실패)');
    console.log(`USER - joinCalendar 성공`, res); //debug//
    alert(`캘린더 가입에 성공했습니다.`);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response?.status === 400) {
      console.error(err.response);
      alert('토큰 정보가 일치하지 않습니다. 다시 로그인해주세요.');
    } else {
      const data = err.response?.data as API.ErrorResponse;
      console.error('그룹 캘린더 가입 에러', data); //debug//
      alert(data?.message);
    }
  }
}

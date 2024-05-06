import { AxiosError } from 'axios';
import * as API from '@utils/api';
import { setCookie } from '@utils/cookie';
import { Cookie, SignInForm, SignUpForm, ErrorResponse } from '@type/index';
import { useNowCalendarStore, useSocialEventStore, useUserInfoStore } from '@store/index';

async function signUp(formData: SignUpForm) {
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
      const data = err.response.data as ErrorResponse;
      console.error(data); //debug//
      alert(data.message);
    }
  }
}

async function logIn(formData: SignInForm) {
  try {
    const { useremail, password } = formData;

    const res = await API.post(`/auth/login`, {
      useremail,
      password,
    });
    if (!res) throw new Error('가입 실패');

    const accessToken: Cookie = {
      name: 'accessToken',
      value: res.data.accessToken,
      options: {
        path: '/',
        maxAge: 3600,
        secure: true,
        sameSite: 'none',
      },
    };

    const refreshToken: Cookie = {
      name: 'refreshToken',
      value: res.data.refreshToken,
      options: {
        path: '/',
        maxAge: 5184000,
        secure: true,
        sameSite: 'none',
      },
    };

    setCookie(accessToken);
    setCookie(refreshToken);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as ErrorResponse;
      console.error(data); //debug//
      alert(data.message);
    }
  }
}

async function setUserInfo() {
  try {
    const {
      data: [db_user],
    } = await API.get(`/auth/all`);
    if (!db_user) throw new Error('유저 정보 db 조회 실패');

    useUserInfoStore.getState().setUserInfo(db_user);
    useNowCalendarStore.getState().setNowCalendar('All');
    useSocialEventStore.getState().setSocialEvents(db_user.userCalendarId.socialEvents);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response?.status === 400) {
      console.error(err.response);
      alert('토큰 정보가 일치하지 않습니다');
      return false;
    } else {
      const data = err.response?.data as ErrorResponse;
      console.error(data); //debug//
      alert(data.message);
    }
  }
}

export { signUp, logIn, setUserInfo };

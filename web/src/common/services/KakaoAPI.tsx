import * as API from '@utils/api';
import axios, { AxiosError } from 'axios';

import { transToKorDate } from '@utils/dateTranslate';
import { setCookie, getCookie, deleteCookie } from '@utils/cookie';
import { useSocialEventStore } from '@store/index';
import { Cookie, SocialEvent } from '@type/index';

const headrOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
};

async function LogIn() {
  try {
    const res = window.Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_REDIRECT_URI,
      // prompt: 'select_account',
    });
    if (!res) throw new Error('로그인 실패');
    alert('카카오톡 로그인 성공');
  } catch (err) {
    console.error(`로그인 에러 : `, err); //debug//
  }
}

async function getToken() {
  try {
    const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get('code');

    if (window.Kakao.Auth.getAccessToken()) return console.log('find kakako Token'); //debug//
    if (!AUTHORIZATION_CODE) return console.log('Authorization code not found.'); //debug//

    const getTokenURL = `https://kauth.kakao.com/oauth/token`;
    const reqTokenData: reqTokenData = {
      grant_type: 'authorization_code',
      client_id: process.env.REACT_APP_KAKAO_CLIENT_REST,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      code: AUTHORIZATION_CODE,
      client_secret: process.env.REACT_APP_KAKAO_CLIENT_SECRET,
    };

    const { data: getToken }: { data: KakaoTokenResponse } = await axios.post(
      getTokenURL,
      reqTokenData,
      headrOptions,
    );

    console.log(`kakaoAPI - getToken =`, getToken); //debug//

    const saveTokenRes = await API.post(`/kakao/save/token`, {
      kakaoAccessToken: getToken.access_token,
      kakaoRefreshToken: getToken.refresh_token,
    });

    if (!saveTokenRes) throw new Error('Refresh Token Registration Failed');
    console.log(`kakaoAPI - saveToken`, saveTokenRes); //debug//

    window.Kakao.Auth.setAccessToken(getToken.access_token, false);
    const kakaoToken: Cookie = {
      name: 'kakaoToken',
      value: getToken.access_token,
      options: {
        path: '/',
        maxAge: 21599,
        secure: true,
        sameSite: 'none',
      },
    };

    setCookie(kakaoToken);
  } catch (err) {
    console.error(err); //debug//
  }
}

async function LogOut() {
  window.Kakao.Auth.logout()
    .then((res: unknown) => {
      deleteCookie(`kakaoToken`);
      console.log(res); //debug//
      alert(`로그아웃 완료`);
    })
    .catch(function () {
      alert('로그인 정보가 없습니다.');
    });
}

async function GetInfo() {
  try {
    const res = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${window.Kakao.Auth.getAccessToken()}`,
      },
    });
    alert(`받아오기 성공`);
    console.log(`Kakao User`, res.data); // debug//
  } catch (error) {
    const err = error as AxiosError<KakaoErrorResponse>;
    if (err.response?.status === 401) {
      console.error(`토큰 유효 정보 없음:`, err.response); //debug//
      alert(`로그인을 먼저 해주세요.`);
    } else {
      console.error(`유저 정보 받아오기 실패 :`, err); //debug//
      alert(`카카오톡 유저정보를 받아오지 못했습니다.`);
    }
  }
}

async function GetEvents() {
  const kakaoToken = getCookie('kakaoToken');

  try {
    if (!kakaoToken) {
      const { data: res }: { data: KakaoEventsAndToken } = await API.post('/kakao/get/calendar', {
        kakaoAccessToken: null,
      });

      const kakaoToken: Cookie = {
        name: 'kakaoToken',
        value: res.accessTokenCheck,
        options: {
          path: '/',
          maxAge: 21599,
          secure: true,
          sameSite: 'none',
        },
      };
      setCookie(kakaoToken);

      const eventLists = res.resultArray.map(
        (event: KakaoEvent): SocialEvent => ({
          title: event.title || '카카오 일정',
          startAt: transToKorDate(event.startAt, 9),
          endAt: transToKorDate(event.endAt, 9),
          isPast: event.deactivatedAt,
          userCalendarId: event.userCalendar?.userCalendarId,
          social: event.social,
          socialEventId: event.socialEventId,
        }),
      );
      useSocialEventStore.getState().setSocialEvents(eventLists);
      console.log(`eventLists`, eventLists);

      return useSocialEventStore.getState();
    } else {
      const { data: res }: { data: KakaoEventsAndToken } = await API.post('/kakao/get/calendar', {
        kakaoAccessToken: getCookie('kakaoToken'),
      });

      console.log(`받아온 일정`, res.resultArray);

      const eventLists = res.resultArray.map(
        (event: KakaoEvent): SocialEvent => ({
          title: event.title || '카카오 일정',
          startAt: transToKorDate(event.startAt, 9),
          endAt: transToKorDate(event.endAt, 9),
          isPast: event.deactivatedAt,
          userCalendarId: event.userCalendar?.userCalendarId,
          social: event.social,
          socialEventId: event.socialEventId,
        }),
      );
      useSocialEventStore.getState().setSocialEvents(eventLists);
      console.log(`eventLists`, eventLists);

      return useSocialEventStore.getState();
    }
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      alert('카카오톡 로그인을 통해 유저 정보를 업데이트 해주세요.');
    } else {
      console.error(`이벤트 받아오기 실패 :`, error); //debug//
    }
  }
}

export { LogIn, getToken, LogOut, GetInfo, GetEvents };

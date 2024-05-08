import axios, { AxiosError } from 'axios';
import * as API from '@utils/api';
import { setCookie, getCookie, deleteCookie } from '@utils/cookie';

import { Cookie } from '@type/index';

const headrOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
};

async function LogIn() {
  try {
    const { data: res } = window.Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_REDIRECT_URI,
      // prompt: 'select_account',
    });
    if (!res) throw new Error('kakao API - 로그인 실패');

    console.log(`KAKAO - LogIn 성공 :`, res); //debug//
    alert('카카오톡 로그인 성공');

    return true;
  } catch (err) {
    const e = err as AxiosError<KakaoErrorResponse>;
    console.log(`KAKAO - LogIn 실패:`, e); //debug//
  }
}

async function getToken() {
  try {
    const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get('code');

    if (window.Kakao.Auth.getAccessToken()) return console.log('KAKAO - getToken : 토큰 존재'); //debug//
    if (!AUTHORIZATION_CODE) return console.log('KAKAO getToken : 인가 코드가 없습니다.'); //debug//

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
    if (!getToken) throw new Error(`kakao API - 토큰 받아오기 실패`);
    console.log(`KAKAO - getToken :`, getToken); //debug//

    const res = await API.post(`/kakao/save/token`, {
      kakaoAccessToken: getToken.access_token,
      kakaoRefreshToken: getToken.refresh_token,
    });

    if (!res) throw new Error('KAKAO - getToken (토큰 DB 저장 실패)');
    console.log(`KAKAO - getToken ( post ) : `, res.status); //debug//

    window.Kakao.Auth.setAccessToken(getToken.access_token, true);
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

    return true;
  } catch (err) {
    console.error(err); //debug//
  }
}

async function LogOut() {
  try {
    const res = window.Kakao.Auth.logout();
    if (!res) throw new Error('kakao API - 연동 해제 및 로그아웃 실패');
    console.log(`KAKAO - Logout 성공 : `, res.id); //debug//

    deleteCookie(`kakaoToken`);

    return true;
  } catch (err) {
    const e = err as KakaoErrorResponse;
    console.log(`KAKAO - Logout 실패 :`, e); //debug//

    if (e?.code === -401) {
      alert('로그인 정보가 없습니다.');
    }
  }
}

async function GetInfo() {
  try {
    const { data: res } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${window.Kakao.Auth.getAccessToken()}`,
      },
    });
    if (!res) throw new Error('kakao API - 유저 정보 받아오기 실패');
    console.log(`KAKAO.getInfo - 성공 : `, res); // debug//

    alert(`카카오 유저 정보를 받아왔습니다.`);

    return true;
  } catch (err) {
    const e = err as AxiosError<KakaoErrorResponse>;
    console.error('KAKAO.getInfo - 실패 :', e); //debug//

    if (e.response?.status === 401) {
      alert(`로그인을 먼저 해주세요.`);
    } else {
      alert(`카카오톡 유저 정보를 받아오지 못했습니다.`);
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
      if (!res) throw new Error('KAKAO - GetEvents (카카오 일정 DB 저장 실패)');

      console.log(`Kakao API - 토큰을 생성합니다.`); //debug//

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

      return res;
    } else {
      const { data: res }: { data: KakaoEventsAndToken } = await API.post('/kakao/get/calendar', {
        kakaoAccessToken: getCookie('kakaoToken'),
      });
      if (!res) throw new Error('KAKAO - GetEvents (카카오 일정 DB 저장 실패)');

      console.log(`Kakao API - 토큰이 이미 존재합니다.`); //debug//

      return res;
    }
  } catch (error) {
    const err = error as AxiosError;
    console.error(`KAKAO - GetEvents 실패 :`, err); //debug//

    if (err.response?.status === 401)
      alert('카카오톡 로그인을 통해 유저 정보를 업데이트 해주세요.');
  }
}

export { LogIn, getToken, LogOut, GetInfo, GetEvents };

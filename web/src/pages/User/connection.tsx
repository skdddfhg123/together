import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { loginRequest } from '../../common/utils/authConfig';

import { Cookie, setCookie } from '@utils/cookie';
import * as KAKAO from '@services/KakaoAPI';
import * as GOOGLE from '@services/googleAPI';

import kakao_box from '@assets/kakao_box.png';
import google_calendar from '@assets/google_calendar.png';
import outlook_circle from '@assets/outlook_circle.png';
import '@styles/connection.css';

export default function ConnectionPage() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    KAKAO.getToken();
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (res) => {
      console.log('구글 로그인 성공', res);

      const googleAccessToken: Cookie = {
        name: 'googleAccessToken',
        value: res.access_token,
        options: {
          path: '/',
          maxAge: 3599,
          secure: true,
          sameSite: 'none',
        },
      };
      setCookie(googleAccessToken);
      sessionStorage.setItem('googleAccessToken', res.access_token);
      // await GOOGLE.getEvents();
    },
    onError: () => console.log('Login Failed'),
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  });

  const handleGoogleLogout = () => {
    googleLogout();
    console.log('Google Logout Success');
  };

  const handleMicrosoftLogin = async () => {
    try {
      const res = await instance.loginPopup(loginRequest);
      console.log('아웃룩 로그인 완료', res);
      const accessToken = res.accessToken;

      const microsoftAccessToken: Cookie = {
        name: 'microsoftAccessToken',
        value: accessToken,
        options: {
          path: '/',
          maxAge: 3599,
          secure: true,
          sameSite: 'none',
        },
      };
      setCookie(microsoftAccessToken);
      sessionStorage.setItem('microsoftAccessToken', accessToken);

      // await fetchMicrosoftEvents(accessToken);
    } catch (error) {
      console.error('Microsoft Login Failed', error);
    }
  };

  const handleMicrosoftLogout = async () => {
    try {
      await instance.logoutPopup();
      console.log('Microsoft Logout Success');
    } catch (error) {
      console.error('Microsoft Logout Failed', error);
    }
  };

  return (
    <div className="FLEX-horizC h-200">
      <h1 className="page-title">동기화 관리 페이지</h1>
      <NavLink className="ANI-btn hover:scale-125 p-5 border rounded-2xl mb-5 text-2xl" to="/main">
        메인으로 가기
      </NavLink>

      <button className="button kakao-button" onClick={KAKAO.LogIn}>
        <img className="w-6" src={kakao_box} />
        <p className="mx-auto">카카오톡 로그인</p>
      </button>
      <button className="button kakao-button" onClick={KAKAO.LogOut}>
        <img className="w-6" src={kakao_box} />
        <p className="mx-auto">카카오톡 로그아웃</p>
      </button>

      <button className="button google-button" onClick={() => login()}>
        <img className="w-6" src={google_calendar} />
        <p className="mx-auto">구글 로그인</p>
      </button>
      <button className="button google-button" onClick={handleGoogleLogout}>
        <img className="w-6" src={google_calendar} />
        <p className="mx-auto">구글 로그아웃</p>
      </button>

      <button className="button microsoft-button" onClick={handleMicrosoftLogin}>
        <img className="w-6" src={outlook_circle} />
        <p className="mx-auto">Microsoft 로그인</p>
      </button>
      <button className="button microsoft-button" onClick={handleMicrosoftLogout}>
        <img className="w-6" src={outlook_circle} />
        <p className="mx-auto">Microsoft 로그아웃</p>
      </button>
    </div>
  );
}

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { useMsal } from '@azure/msal-react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { loginRequest } from '../../common/utils/authConfig';

import { Cookie, setCookie } from '@utils/cookie';
import * as KAKAO from '@services/KakaoAPI';
import * as GOOGLE from '@services/googleAPI';

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
      await GOOGLE.getEvents();
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
    <div className="FLEX-horizC">
      <h1>동기화 관리 페이지</h1>
      <button onClick={KAKAO.LogIn}>카카오톡 로그인</button>
      {/* <button onClick={KAKAO.GetInfo}>카톡 유저 정보받기</button> */}
      <button onClick={KAKAO.LogOut}>카카오톡 로그아웃</button>

      <button onClick={() => login()}>구글 로그인</button>
      <button onClick={handleGoogleLogout}>구글 로그아웃</button>

      <button onClick={handleMicrosoftLogin}>Microsoft 로그인</button>
      <button onClick={handleMicrosoftLogout}>Microsoft 로그아웃</button>

      <NavLink to="/main">메인으로 가기</NavLink>
    </div>
  );
}

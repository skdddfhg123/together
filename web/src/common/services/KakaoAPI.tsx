import * as API from '@utils/api';

import { Cookie } from 'common/type';
import { setCookie, getCookie } from '@utils/cookie';

async function LogIn() {
  window.Kakao.Auth.login({
    success: function (authObj) {
      console.log('kakao 로그인 성공', authObj);
      const kakakoCookie: Cookie = {
        name: 'kakaoToken',
        value: authObj.access_token,
        options: {
          path: '/',
          maxAge: 7199,
          secure: false,
          sameSite: 'lax',
        },
      };
      setCookie(kakakoCookie);
    },
    fail: function (err) {
      console.error('kakao 로그인 실패', err);
    },
  });
}

async function LogOut() {
  window.Kakao.API.request({
    url: '/v1/user/unlink',
    success: function (response) {
      console.log('kakao 연결 끊기 성공', response);
    },
    fail: function (error) {
      console.error('kakao 연결 끊기 실패', error);
    },
  });
}

async function GetInfo() {
  window.Kakao.API.request({
    url: '/v2/user/me',
    success: function (response: unknown) {
      console.log(`kakao 정보`, response);
    },
    fail: function (error: unknown) {
      console.log(`kakao 정보 받기 싫패`, error);
    },
  });
}

async function GetEvents() {
  return await API.post(`/kakao/calendar`, {
    kakaoToken: getCookie('kakaoToken'),
  });
}

export { LogIn, LogOut, GetInfo, GetEvents };

// import React, { useEffect } from 'react';

// export default function KakaoSignIn() {
//   const initKakao = () => {
//     if (window.Kakao && window.Kakao.isInitialized()) {
//       console.log('Kakao SDK Already Initialized');
//       return;
//     }
//     const kakaoScript = document.createElement('script');
//     kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js';
//     document.head.appendChild(kakaoScript);

//     kakaoScript.onload = () => {
//       window.Kakao.init(`${process.env.REACT_APP_KAKAO_CLIENT_JS}`);
//       if (window.Kakao.isInitialized()) {
//         console.log('Kakao SDK Initialized');
//       }
//     };
//   };

//   useEffect(() => {
//     initKakao();
//   }, []);

//   const kakaoLogIn = () => {
//     window.Kakao.Auth.authorize({
//       redirectUri: `${process.env.REACT_APP_REDIRECT_URI}`,
//       scope: 'profile_nickname, account_email, name',
//     });
//   };

//   const kakakoLogOut = () => {
//     window.Kakao.API.request({
//       url: '/v1/user/unlink',
//       success: function (response) {
//         console.log('연결 끊기 성공', response);
//       },
//       fail: function (error) {
//         console.error('연결 끊기 실패', error);
//       },
//     });
//   };
//   return (
//     <div>
//       <button onClick={kakaoLogIn}>카카오 로그인</button>
//       <button onClick={kakakoLogOut}>카카오 로그아웃</button>
//     </div>
//   );
// }

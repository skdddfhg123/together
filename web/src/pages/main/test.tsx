import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as API from '@utils/api';

import * as KAKAO from '@services/KakaoAPI';

export default function TestPage() {
  const [profile, setProfile] = useState('');

  function getCookie(name: string) {
    const matches = document.cookie.match(
      new RegExp(
        '(?:^|; )' +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
          '=([^;]*)',
      ),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  const accessToken = getCookie('ourToken');

  const getProfile = async () => {
    try {
      const res = await API.get(`/auth/token-test`);
      // setProfile(res.data);
      console.log(res);
    } catch (e) {}
  };

  return (
    <div className="flex flex-col items-center">
      <h1>TEST PAGE</h1>
      <Link to={`/signin`}>로그인 하러 가기</Link>
      <button onClick={getProfile}>쿠키</button>
      {/* <div>{profile ? profile : ''}</div> */}
      <button onClick={KAKAO.LogIn}>카카오 로그인</button>
    </div>
  );
}

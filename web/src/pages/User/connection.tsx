import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import * as KAKAO from '@services/KakaoAPI';

export default function ConnectionPage() {
  useEffect(() => {
    KAKAO.getToken();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1>동기화 관리 페이지</h1>
      <button onClick={KAKAO.LogIn}>카카오톡 로그인</button>
      <button onClick={KAKAO.GetInfo}>카톡 유저 정보받기</button>
      <button onClick={KAKAO.LogOut}>카카오톡 로그아웃</button>
      <NavLink to="/main">메인으로 가기</NavLink>
    </div>
  );
}

import React from 'react';
import * as KAKAKO from '@services/KakaoAPI';
import { NavLink } from 'react-router-dom';

export default function ConnectionPage() {
  return (
    <div className="flex flex-col items-center">
      <h1>동기화 관리 페이지</h1>
      <button onClick={KAKAKO.LogIn}>카카오톡 로그인</button>
      <button onClick={KAKAKO.LogOut}>카카오톡 로그아웃</button>
      <NavLink to="/main">메인으로 가기</NavLink>
    </div>
  );
}

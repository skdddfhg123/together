import React from 'react';
import { NavLink } from 'react-router-dom';

export default function UserInfoPage() {
  return (
    <div className="flex flex-col items-center">
      <h1>유저 정보 페이지</h1>
      <NavLink to="/main">메인으로 가기</NavLink>
    </div>
  );
}

import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import * as API from '@utils/api';
import { useUserInfoStore } from '@store/index';

export default function UserInfoPage() {
  const user = useUserInfoStore((state) => state.userInfo);
  const { setUserInfo } = useUserInfoStore((state) => ({
    setUserInfo: state.setUserInfo,
  }));

  const getUserInfo = useCallback(async () => {
    try {
      const res = await API.get('/auth/token-test');
      if (!res) throw new Error('유저 정보 받아오기 실패');
      setUserInfo(res.data);
      console.log(`userInfo Store : `, res.data);
    } catch (e) {
      console.error(e);
    }
  }, [setUserInfo]);

  return (
    <div className="flex flex-col items-center">
      <h1>유저 정보 페이지</h1>
      <NavLink to="/main">메인으로 가기</NavLink>
      <button onClick={getUserInfo}>유저 정보 받아오기</button>
      {user && (
        <div>
          <h2>프로필 정보</h2>
          <p>이름: {user.nickname}</p>
          <p>이메일: {user.useremail}</p>
        </div>
      )}
    </div>
  );
}

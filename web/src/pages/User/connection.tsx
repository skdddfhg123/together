import React from 'react';
import * as KAKAKO from '@services/KakaoAPI';

export default function ConnectionPage() {
  return (
    <div>
      <h1>동기화 관리 페이지</h1>
      <button onClick={KAKAKO.LogIn}>카카오톡 로그인</button>
    </div>
  );
}

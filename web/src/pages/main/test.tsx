import React from 'react';
import { Link } from 'react-router-dom';

export default function TestPage() {
  return (
    <div className="FLEX-horizC">
      <h1>TEST PAGE</h1>
      <Link to={`/signin`}>로그인 하러 가기</Link>
    </div>
  );
}

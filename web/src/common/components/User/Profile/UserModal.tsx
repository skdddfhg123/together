import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as USER from '@services/userAPI';
import defaultUserImg from '@assets/default_user.png';
import '@styles/modalStyle.css';

export default React.memo(function UserModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleRedirect = (path: string) => {
    navigate(path);
    setModalOpen(false);
  };

  const handleLogOut = async () => {
    await USER.logOut();
    navigate('/signin');
    setModalOpen(false);
  };

  return (
    <div className="relative inline-block">
      <img
        className="w-12 h-12 cursor-pointer"
        src={defaultUserImg}
        onClick={handleToggle}
        alt="user-button"
      />
      <section className={`userModal${modalOpen ? ' open' : ''} w-36 h-fit -left-full`}>
        {modalOpen && (
          <div className="FLEX-horizC mx-auto">
            <button
              className="w-full h-10 hover:bg-custom-light"
              onClick={() => handleRedirect('/userinfo')}
            >
              프로필 사진 수정
            </button>
            <button
              className="w-full h-10 hover:bg-custom-light"
              onClick={() => handleRedirect('/connection')}
            >
              동기화 계정 관리
            </button>
            <button
              className="w-full h-10 hover:bg-custom-light"
              onClick={() => handleRedirect('/userinfo')}
            >
              유저 정보 관리
            </button>
            <button className="w-full h-10 hover:bg-custom-light" onClick={() => handleLogOut()}>
              로그아웃
            </button>
          </div>
        )}
      </section>
    </div>
  );
});

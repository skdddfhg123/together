import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useToggle from '@hooks/useToggle';
import * as USER from '@services/userAPI';
import { useUserInfoStore } from '@store/index';

import UpdateThumbnail from '@components/User/Profile/UpdateThumbnail';
import defaultUserImg from '@assets/default_user.png';
import '@styles/modalStyle.css';

export default React.memo(function UserModal() {
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);

  const { userInfo } = useUserInfoStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleRedirect = (path: string) => {
    navigate(path);
    setModalOpen(false);
  };

  const handleLogOut = async () => {
    await USER.logOut();
    window.location.replace(`/signin`);
    setModalOpen(false);
  };

  useEffect(() => {
    console.log(`썸네일 변경됨`);
  }, [userInfo]);

  return (
    <div className="relative inline-block">
      <img
        key={userInfo?.thumbnail}
        className="w-16 h-16 object-contain p-1 border rounded-full cursor-pointer"
        src={userInfo?.thumbnail ? userInfo.thumbnail : defaultUserImg}
        onClick={handleToggle}
        alt="user-button"
      />
      <section className={`userModal${modalOpen ? ' open' : ''} w-36 h-fit -left-full`}>
        {modalOpen && (
          <div className="FLEX-horizC mx-auto">
            <button
              className="w-full h-10 hover:bg-custom-light"
              onClick={() => {
                handleToggle();
                toggle();
              }}
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
      <UpdateThumbnail userInfo={userInfo} isOpen={isOn} onClose={toggle} />
    </div>
  );
});

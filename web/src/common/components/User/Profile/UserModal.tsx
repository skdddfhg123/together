import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import defaultUserImg from '@assets/default_user.png';
import '@styles/UserModal.css';

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

  return (
    <div className="relative inline-block">
      <img
        className="w-12 h-12 cursor-pointer"
        src={defaultUserImg}
        onClick={handleToggle}
        alt="user-button"
      />
      <section className={`modal${modalOpen ? ' open' : ''} w-36 h-fit -left-full`}>
        {modalOpen && (
          <div className="flex flex-col items-center justify-center mx-auto">
            <button
              className="w-full h-10 modal-option hover:bg-custom-light"
              onClick={() => handleRedirect('/connection')}
            >
              동기화 계정 관리
            </button>
            <button
              className="w-full h-10 modal-option hover:bg-custom-light"
              onClick={() => handleRedirect('/userinfo')}
            >
              유저 정보 관리
            </button>
          </div>
        )}
      </section>
    </div>
  );
});

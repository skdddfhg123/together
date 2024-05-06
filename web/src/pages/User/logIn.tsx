import React from 'react';
import { useNavigate } from 'react-router-dom';

import SignUp from '@components/User/SignUp';
import SignIn from '@components/User/SignIn';
import useToggle from '@hooks/useToggle';

import * as USER from '@services/userAPI';
import { SignUpForm, SignInForm } from '@type/index';

export default function LogInPage() {
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);

  const handleLogIn = async (formData: SignInForm) => {
    const res = await USER.logIn(formData);
    if (!res) return;
    alert('로그인 성공');
    navigate('/main');
  };

  const handleSingUp = async (formData: SignUpForm) => {
    const res = await USER.signUp(formData);
    if (!res) return;
    alert('정상적으로 가입되었습니다! ');
    toggle();
  };

  return (
    <div className="h-full w-3/5 mt-28 flex flex-col mx-auto items-center justify-center">
      <section>
        <button id="singin" onClick={toggle}>
          {isOn ? '로그인으로' : '회원가입으로'}
        </button>
      </section>
      {isOn ? <SignUp onSubmit={handleSingUp} /> : <SignIn onSubmit={handleLogIn} />}
    </div>
  );
}

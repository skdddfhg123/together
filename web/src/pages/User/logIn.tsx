import React from 'react';
import { useNavigate } from 'react-router-dom';

import useToggle from '@hooks/useToggle';
import sendToast from '@hooks/sendToast';
import * as USER from '@services/userAPI';
import { SignUpForm, SignInForm } from '@type/index';

import SignUp from '@components/User/SignUp';
import SignIn from '@components/User/SignIn';

export default function LogInPage() {
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);

  const submitSignIn = async (formData: SignInForm) => {
    const res = await USER.logIn(formData);
    if (!res) return;
    sendToast('success', '로그인 성공');
    navigate('/main');
  };

  const submitSignUp = async (formData: SignUpForm) => {
    const res = await USER.signUp(formData);
    if (!res) return;
    sendToast('success', '정상적으로 가입되었습니다! ');
    toggle();
  };

  return (
    <div className="FLEX-horizC h-full w-3/5 mx-auto">
      <h1 className="my-20 text-6xl text-custom-main text-shadow-blue">Tooghter</h1>
      <section>
        <button id="singin" onClick={toggle}>
          {isOn ? '로그인으로' : '회원가입으로'}
        </button>
      </section>
      {isOn ? <SignUp onSubmit={submitSignUp} /> : <SignIn onSubmit={submitSignIn} />}
    </div>
  );
}

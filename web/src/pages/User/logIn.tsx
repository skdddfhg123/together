import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import SignUp from '@components/User/SignUp';
import SignIn from '@components/User/SignIn';
import { useToggle } from '@hooks/useToggle';

import * as USER from '@services/userAPI';
import { SignUpForm, SignInForm, ErrorResponse } from '@type/index';

export default function LogInPage() {
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);

  const handleLogIn = async (formData: SignInForm) => {
    try {
      await USER.logIn(formData);
      await USER.getInfo();

      alert('로그인 성공');
      navigate('/main');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response) {
        const data = err.response.data as ErrorResponse;
        console.log(data); //debug//
        alert(data.message);
        return;
      }
    }
  };

  const handleSingUp = async (formData: SignUpForm) => {
    try {
      await USER.signUp(formData);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response) {
        const data = err.response.data as ErrorResponse;
        console.log(data); //debug//
        alert(data.message);
      }
    }
    alert('정상적으로 가입되었습니다! ');
    toggle();
  };

  return (
    <div className="h-160 w-3/5 flex flex-col mx-auto items-center justify-center">
      <section>
        <button id="singin" onClick={toggle}>
          {isOn ? '로그인으로' : '회원가입으로'}
        </button>
      </section>
      {isOn ? <SignUp onSubmit={handleSingUp} /> : <SignIn onSubmit={handleLogIn} />}
    </div>
  );
}

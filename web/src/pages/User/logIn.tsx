import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import SignUp from '@components/User/SignUp';
import SignIn from '@components/User/SignIn';

import useToggle from '@hooks/useToggle';
import * as API from '@utils/api';
import { Cookie } from '../../common/types';
import { setCookie } from '@utils/cookie';

interface SignInForm {
  useremail: string;
  password: string;
}

interface SignUpForm extends SignInForm {
  nickname: string;
}

interface ErrorResponse {
  message: string;
}

export default function LogInPage() {
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);

  const handleLogIn = async (formData: SignInForm) => {
    const { useremail, password } = formData;
    try {
      const res = await API.post(`/auth/login`, {
        useremail,
        password,
      });
      if (!res) throw new Error('가입 실패');
      console.log(res); //debug//

      const loginCookie: Cookie = {
        name: 'accessToken',
        value: res.data.accessToken,
        options: {
          path: '/',
          maxAge: 3600,
          secure: true,
          sameSite: 'strict',
        },
      };
      setCookie(loginCookie);

      alert('로그인 성공');
      navigate('/main');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response) {
        const data = err.response.data as ErrorResponse;
        console.log(data); //debug//
        alert(data.message);
      }
    }
  };

  const handleSingUp = async (formData: SignUpForm) => {
    const { useremail, nickname, password } = formData;
    try {
      const res = await API.post(`/auth/signup`, {
        useremail,
        nickname,
        password,
      });
      if (!res) throw new Error('가입 실패');
      console.log(res); //debug//
      alert('정상적으로 가입되었습니다! ');
      toggle();
    } catch (e) {
      const err = e as AxiosError;
      if (err.response) {
        const data = err.response.data as ErrorResponse;
        console.log(data); //debug//
        alert(data.message);
      }
    }
  };

  return (
    <div className="h-160 w-3/5 flex flex-col mx-auto items-center justify-center">
      <section>
        <button id="singin" onClick={toggle}>
          {isOn ? '로그인으로' : '회원가입으로'}
        </button>
      </section>
      {isOn ? (
        <SignUp onSubmit={handleSingUp} />
      ) : (
        <SignIn onSubmit={handleLogIn} />
      )}
    </div>
  );
}

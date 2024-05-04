import * as API from '@utils/api';
import { setCookie } from '@utils/cookie';
import { Cookie, SignInForm, SignUpForm } from '@type/index';

async function signUp(formData: SignUpForm) {
  const { useremail, nickname, password } = formData;
  const res = await API.post(`/auth/signup`, {
    useremail,
    nickname,
    password,
  });
  if (!res) throw new Error('가입 실패');
  console.log(res); //debug//
}

async function logIn(formData: SignInForm) {
  const { useremail, password } = formData;
  const res = await API.post(`/auth/login`, {
    useremail,
    password,
  });
  if (!res) throw new Error('가입 실패');
  console.log(res); //debug//

  const accessToken: Cookie = {
    name: 'accessToken',
    value: res.data.accessToken,
    options: {
      path: '/',
      maxAge: 3600,
      secure: true,
      sameSite: 'none',
    },
  };
  const refreshToken: Cookie = {
    name: 'refreshToken',
    value: res.data.refreshToken,
    options: {
      path: '/',
      maxAge: 5184000,
      secure: true,
      sameSite: 'none',
    },
  };
  setCookie(accessToken);
  setCookie(refreshToken);
}

export { signUp, logIn };

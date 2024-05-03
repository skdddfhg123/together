import * as API from '@utils/api';
import { setCookie } from '@utils/cookie';
import { useUserInfoStore } from '@store/index';
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

  const loginCookie: Cookie = {
    name: 'accessToken',
    value: res.data.accessToken,
    options: {
      path: '/',
      maxAge: 3600,
      secure: true,
      sameSite: 'none',
    },
  };
  setCookie(loginCookie);
}

async function getInfo() {
  const { setUserInfo } = useUserInfoStore((state) => ({
    setUserInfo: state.setUserInfo,
  }));

  const res = await API.get('/auth/token-test');
  if (!res) throw new Error('유저 정보 받아오기 실패');
  setUserInfo(res.data);
  console.log(`userInfo Store : `, res.data);
}

export { signUp, logIn, getInfo };

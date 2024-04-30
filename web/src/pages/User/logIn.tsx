import React from 'react';

import SignUp from '../../common/components/User/SignUp';
import SignIn from '../../common/components/User/SignIn';
import useToggle from '../../common/hooks/useToggle';

interface SignInForm {
  useremail: string;
  password: string;
}

interface SignUpForm extends SignInForm {
  nickname: string;
}

export default function SignInPage() {
  const { isOn, toggle } = useToggle(false);

  const handleLogIn = async (formData: SignInForm) => {
    // const { useremail, password } = formData;
    try {
    } catch (err: unknown) {
      alert('로그인 실패 🥺');
    }
  };

  const handleSingUp = async (formData: SignUpForm) => {
    // const { useremail, nickname, password } = formData;
    try {
    } catch (err: unknown) {
      alert('가입에 실패했습니다. 😧');
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

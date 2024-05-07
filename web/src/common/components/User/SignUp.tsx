import React, { useState, useRef } from 'react';

interface SignUpProps {
  onSubmit: (formData: SignUpForm) => void;
}

interface SignUpForm {
  useremail: string;
  nickname: string;
  password: string;
}

export default function SignUp({ onSubmit }: SignUpProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const useremailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [emailValid, setEmailValid] = useState<boolean | null>(true);
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(true);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(true);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(true);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleInputChange = (ref: React.RefObject<HTMLInputElement>) => {
    const value = ref.current?.value ?? '';
    if (ref === useremailRef) {
      setEmailValid(emailRegex.test(value));
    } else if (ref === nicknameRef) {
      setNicknameValid(value.length >= 4 && value.length <= 10);
    } else if (ref === passwordRef || ref === confirmPasswordRef) {
      const password = passwordRef.current?.value ?? '';
      const confirmPassword = confirmPasswordRef.current?.value ?? '';
      setPasswordValid(password.length >= 4);
      setPasswordsMatch(password === confirmPassword);
    }
  };

  const submitForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const useremail = useremailRef.current?.value;
    const nickname = nicknameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!useremail || !nickname || !password || !confirmPassword) {
      alert('폼을 모두 채워주세요.');
      return;
    }

    if (!emailValid || !nicknameValid || !passwordValid || !passwordsMatch) {
      alert('양식에 맞춰 다시 작성해주세요.');
      return;
    }

    const formData = {
      useremail,
      nickname,
      password,
    };

    onSubmit(formData);
    formRef.current?.reset();
  };

  return (
    <form className="FLEX-horizC h-5/6" ref={formRef}>
      <fieldset className="FLEX-horizC h-5/6">
        <label className="w-full mb-2" htmlFor="email">
          EMAIL
        </label>
        <input
          className={`SIGN-input ${emailValid ? '' : 'border-red-500 focus:border-red-500'}`}
          id="useremail"
          type="email"
          maxLength={50}
          ref={useremailRef}
          onChange={() => handleInputChange(useremailRef)}
          aria-invalid={!emailValid}
          placeholder="krafton@jungle.com"
          autoComplete="off"
          required
        />
        <div className="FLEX-verC h-10">{emailValid ? '' : '유효하지 않은 이메일 형식입니다.'}</div>
        <label className="w-full mb-2" htmlFor="nickname">
          NICKNAME
        </label>
        <input
          className={`SIGN-input ${nicknameValid ? '' : 'border-red-500 focus:border-red-500'}`}
          id="nickname"
          type="nickname"
          maxLength={11}
          ref={nicknameRef}
          onChange={() => handleInputChange(nicknameRef)}
          aria-invalid={!nicknameValid}
          placeholder="난정글러"
          autoComplete="off"
          required
        />
        <div className="FLEX-verC h-10">{nicknameValid ? '' : '4~10자 사이여야 합니다.'}</div>
        <label className="w-full mb-2" htmlFor="password">
          PASSWORD
        </label>
        <input
          className={`SIGN-input ${passwordValid ? '' : 'border-red-500 focus:border-red-500'}`}
          id="password"
          type="password"
          ref={passwordRef}
          onChange={() => handleInputChange(passwordRef)}
          aria-invalid={!passwordValid}
          placeholder="****"
          required
        />
        <div className="FLEX-verC h-10">{passwordValid ? '' : '4글자 이상 입력해주세요.'}</div>
        <label className="w-full mb-2" htmlFor="confirmPassword">
          CONFIRM PASSWORD
        </label>
        <input
          className={`SIGN-input ${passwordsMatch ? '' : 'border-red-500 focus:border-red-500'}`}
          id="confirmPassword"
          type="password"
          ref={confirmPasswordRef}
          onChange={() => handleInputChange(confirmPasswordRef)}
          aria-invalid={!passwordsMatch}
          placeholder="****"
          required
        />
        <div className="FLEX-verC h-10">
          {passwordsMatch ? '' : '비밀번호가 서로 일치하지 않습니다.'}
        </div>
      </fieldset>
      <button onClick={submitForm}>회원가입</button>
    </form>
  );
}

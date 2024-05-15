import React, { useState, useRef } from 'react';
import sendToast from '@hooks/useToast';

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
      setNicknameValid(value.length > 0 && value.length <= 10);
    } else if (ref === passwordRef || ref === confirmPasswordRef) {
      const password = passwordRef.current?.value ?? '';
      const confirmPassword = confirmPasswordRef.current?.value ?? '';
      setPasswordValid(password.length >= 4);
      setPasswordsMatch(password === confirmPassword);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const useremail = useremailRef.current?.value.trim();
    const nickname = nicknameRef.current?.value.trim();
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!useremail || !nickname || !password || !confirmPassword) {
      return sendToast('error', '폼을 모두 채워주세요.');
    }

    if (!emailValid || !nicknameValid || !passwordValid || !passwordsMatch) {
      return sendToast('error', '양식에 맞춰 다시 작성해주세요.');
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
    <form className="flex flex-col justify-between w-160 h-128" ref={formRef}>
      <fieldset className="FLEX-horiz text-xl">
        <label htmlFor="email">EMAIL</label>
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
        <label htmlFor="nickname">NICKNAME</label>
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
        <div className="FLEX-verC h-10">{nicknameValid ? '' : '10글자 이하로 입력해주세요.'}</div>
        <label htmlFor="password">PASSWORD</label>
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
        <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
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
      <button
        className="BTN w-40 mx-auto rounded-2xl text-2xl
        ANIMATION hover:bg-custom-light hover:scale-150"
        onClick={handleSubmit}
      >
        회원가입
      </button>
    </form>
  );
}

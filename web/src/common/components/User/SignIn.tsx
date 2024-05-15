import React, { useRef } from 'react';

interface SignInProps {
  onSubmit: (formData: SignIpForm) => void;
}

interface SignIpForm {
  useremail: string;
  password: string;
}

export default function SignIn({ onSubmit }: SignInProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const useremailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const useremail = useremailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!useremail || !password) {
      return;
    }

    const formData = {
      useremail,
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
          className="SIGN-input mb-10"
          id="email"
          type="email"
          ref={useremailRef}
          placeholder="krafton@jungle.com"
          autoComplete="off"
          required
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          className="SIGN-input mb-10"
          id="password"
          type="password"
          ref={passwordRef}
          placeholder="****"
          required
        />
      </fieldset>
      <button
        className="BTN w-40 mx-auto rounded-2xl text-2xl
        ANIMATION hover:bg-custom-light hover:scale-150"
        onClick={handleSubmit}
      >
        로그인
      </button>
    </form>
  );
}

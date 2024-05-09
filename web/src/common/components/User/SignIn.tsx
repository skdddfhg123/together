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

  const submitSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <form className="FLEX-horizC h-5/6" ref={formRef}>
      <fieldset className="FLEX-horizC h-5/6">
        <label className="w-full mb-2" htmlFor="email">
          EMAIL
        </label>
        <input
          className="SIGN-input mb-10"
          id="email"
          type="email"
          ref={useremailRef}
          placeholder="krafton@jungle.com"
          autoComplete="off"
          required
        />
        <label className="w-full mb-2 " htmlFor="password">
          PASSWORD
        </label>
        <input
          className="SIGN-input mb-10"
          id="password"
          type="password"
          ref={passwordRef}
          placeholder="****"
          required
        />
      </fieldset>
      <button onClick={submitSignIn}>로그인</button>
    </form>
  );
}

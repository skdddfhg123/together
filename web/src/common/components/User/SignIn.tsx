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

  const submitForm = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    // formRef.current.reset();
  };
  return (
    <form className="h-5/6 flex flex-col items-center justify-center" ref={formRef}>
      <fieldset className="h-5/6 flex flex-col items-center justify-center">
        <label className="w-full mb-2" htmlFor="email">
          EMAIL
        </label>
        <input
          className="sign-input mb-10 transition duration-300 
          focus:border-blue-600 focus:border-2 focus:outline-none"
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
          className="sign-input transition duration-300 
          focus:border-blue-600 focus:border-2 focus:outline-none"
          id="password"
          type="password"
          ref={passwordRef}
          placeholder="****"
          required
        />
      </fieldset>
      <button onClick={submitForm}>로그인</button>
    </form>
  );
}

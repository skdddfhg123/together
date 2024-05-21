// src/Register.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import useToast from '@hooks/useToast';
import useToggle from '@hooks/useToggle';
import * as USER from '@services/userAPI';
import * as REDIS from '@services/redisAPI';
import { SignUpForm, SignInForm } from '@type/index';
import {
  useAllEventListStore,
  useCalendarListStore,
  useEventFeedListStore,
  useGroupEventListStore,
  useSelectedCalendarStore,
  useSelectedDayStore,
  useSocialEventListStore,
  useUserInfoStore,
} from '@store/index';

import SignUp from '@components/User/SignUp';
import SignIn from '@components/User/SignIn';

import logoImg from '@assets/toogether_noBG.png';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InvitePage() {
  const query = useQuery();
  const inviteCode = query.get('invite');
  const navigate = useNavigate();
  const { isOn, toggle } = useToggle(false);

  const submitSignIn = async (formData: SignInForm) => {
    const res = await USER.logIn(formData);
    if (!res) return;
    if (inviteCode) await USER.joinCalendar(inviteCode);
    navigate('/main');
  };

  const submitSignUp = async (formData: SignUpForm) => {
    const res = await USER.signUp(formData);
    if (!res) return;
    useToast('success', '정상적으로 가입되었습니다! ');
    toggle();
  };

  // useEffect(() => {
  //   REDIS.Unconnect();

  //   useUserInfoStore.getState().reset();
  //   useCalendarListStore.getState().reset();
  //   useSelectedCalendarStore.getState().reset();
  //   useSelectedDayStore.getState().reset();
  //   useGroupEventListStore.getState().reset();
  //   useSocialEventListStore.getState().reset();
  //   useAllEventListStore.getState().reset();
  //   useEventFeedListStore.getState().reset();

  //   sessionStorage.clear();
  //   localStorage.clear();
  // }, []);

  return (
    <div className="FLEX-horiz h-lvh w-3/5 mx-auto">
      {logoImg ? (
        <img className="my-10" src={logoImg} alt="Main Logo" />
      ) : (
        <h1 className="my-20 text-6xl text-custom-main text-shadow-blue">Tooghter</h1>
      )}
      <section className="flex flex-col items-center h-full space-y-4">
        <button
          id="singin"
          className="BTN w-40 mx-auto rounded-2xl text-2xl hover:scale-150
            ANIMATION hover:bg-custom-main hover:text-white"
          onClick={toggle}
        >
          {isOn ? '로그인으로' : '회원가입으로'}
        </button>
        {isOn ? <SignUp onSubmit={submitSignUp} /> : <SignIn onSubmit={submitSignIn} />}
      </section>
    </div>
  );
}

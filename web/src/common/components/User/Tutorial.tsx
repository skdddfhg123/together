import React, { useState } from 'react';
import Modal from 'react-modal';

import * as KAKAO from '@services/KakaoAPI';
import '@styles/modalStyle.css';
import kakaoInfo from '@assets/tutorial/kakao_info.png';
import kakaoLogin from '@assets/tutorial/kakao_login.png';
import synchronizationIcon from '@assets/tutorial/synchronization_icon.png';
import synchronizationManage from '@assets/tutorial/synchronization_manage.png';
import mainPageSyncBTN from '@assets/tutorial/sync_btn_main.png';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function Tutorial({ isOpen, onClose }: TutorialProps) {
  const [stage, setStage] = useState(0);
  const messages = [
    ['처음 온 것을 환영해요!', 'Toogether 기능 중 하나인 외부 플랫폼 동기화하는 법을 알아봐요!'],
    ['먼저 외부 플랫폼에 로그인을 합니다.', '지금은 카카오톡을 예로 알려드릴게요.'],
    ['그 다음, < 외부 플랫폼 일정 가져오기 > 버튼을 눌러주세요!'],
    ['이제 Toogether를 시작해볼까요?'],
  ];
  const functionButtonNames = [
    '',
    '카카오톡 로그인',
    '카카오 톡캘린더 일정 가져오기',
    '메인으로 돌아가기',
  ];
  const images = {
    1: [synchronizationManage, kakaoLogin],
    2: [kakaoInfo, mainPageSyncBTN],
  };

  const functionTest1 = async () => {
    console.log('카카오톡 로그인 실행');
    await KAKAO.LogIn();
  };

  const functionTest2 = async () => {
    console.log('카카오 톡캘린더 일정 가져오기 실행');
    await KAKAO.GetEvents();
  };

  const functionTest3 = () => {
    onClose();
  };

  const handleNext = () => {
    setStage((prev) => prev + 1);
  };

  const runCustomFunction = () => {
    switch (stage) {
      case 1:
        functionTest1();
        break;
      case 2:
        functionTest2();
        break;
      case 3:
        functionTest3();
        break;
      default:
        console.log('No function assigned for this stage.');
    }
  };

  return (
    <Modal
      className="feedModal"
      overlayClassName="feedOverlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="FLEX-horizC items-center w-full h-full space-y-10">
        <div className="text-center space-y-4 text-4xl">
          {messages[stage].map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="FLEX-verC items-center w-full h-1/2 space-x-4 mb-10">
          {stage === 1 || stage === 2
            ? images[stage].map((img, index) => (
                <img
                  className="w-72 h-fit"
                  key={index}
                  src={img}
                  alt={`Stage ${stage} Image ${index + 1}`}
                />
              ))
            : null}
        </div>

        <div className="w-2/3 mt-10 FLEX-verA">
          {stage > 0 && (
            <button
              className="ANI-btn px-4 py-2 bg-green-500 text-3xl rounded-2xl text-white hover:bg-green-600"
              onClick={runCustomFunction}
            >
              {functionButtonNames[stage]}
            </button>
          )}

          {stage < messages.length - 1 && (
            <button
              className="ANI-btn px-4 py-2 bg-blue-500 text-3xl rounded-2xl text-white hover:bg-blue-600"
              onClick={handleNext}
            >
              다음으로 가기
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

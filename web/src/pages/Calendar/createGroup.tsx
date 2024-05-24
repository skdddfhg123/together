import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useToast from '@hooks/useToast';
import * as CALENDAR from '@services/calendarAPI';

const colors = [
  { code: '#90CAF9', name: '딥 스카이 블루' },
  { code: '#A5D6A7', name: '에메랄드 그린' },
  { code: '#80DEEA', name: '모던 사이언' },
  { code: '#FFE082', name: '앰버 옐로우' },
  { code: '#EEEEEE', name: '그레이' },
  { code: '#FFCCBC', name: '코랄 핑크' },
  { code: '#F8BBD0', name: '프렌치 로즈' },
  { code: '#D1C4E9', name: '소프트 바이올렛' },
  { code: '#FFCDD2', name: '애플 레드' },
  { code: '#9FA8DA', name: '인디고 블루' },
];

export default function CreateGroupPage() {
  const titleRef = useRef<HTMLInputElement>(null);
  const [groupType, setGroupType] = useState<string>('#90CAF9');
  const navigate = useNavigate();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const groupTitle = titleRef.current?.value;
    if (!groupTitle) return useToast('default', '생성할 그룹명을 입력해주세요.');

    const res = await CALENDAR.createGroupCalendar({
      title: groupTitle,
      type: groupType,
    });
    if (!res) throw new Error('그룹 캘린더 생성 실패');

    useToast('success', '그룹 캘린더가 생성되었습니다.');
    navigate('/main');
  };

  return (
    <div className={`FLEX-horizC h-128`}>
      <h1 className={`m-10`}>그룹 캘린더 생성</h1>
      <form className="FLEX-horizC h-5/6" onSubmit={submitForm}>
        <fieldset className="FLEX-horizC">
          <section
            className={`w-2/3 mb-5 p-5 text-xl flex justify-center flex-wrap bg-gray-500 rounded`}
          >
            <div className="w-full text-center mb-10 text-3xl font-bold text-white">
              그룹 색 지정
            </div>
            {colors.map((color) => (
              <label
                key={color.code}
                className={`p-2 mx-4 text-2xl font-semibold`}
                style={{ color: color.code }}
              >
                <input
                  className={`mr-2`}
                  type="radio"
                  name="groupType"
                  onChange={() => setGroupType(color.code)}
                  value={color.code}
                  checked={groupType === color.code}
                />
                {color.name}
              </label>
            ))}
          </section>
          <label>
            <input className={`SIGN-input`} type="text" ref={titleRef} placeholder="그룹명 입력" />
          </label>
        </fieldset>
        <div className="FLEX-verA w-1/2 m-10">
          <Link className="BTN ANI-btn text-2xl font-bold rounded p-2" to="/main">
            뒤로가기
          </Link>
          <button className="BTN ANI-btn text-2xl font-bold rounded p-2" type="submit">
            캘린더 만들기
          </button>
        </div>
      </form>
    </div>
  );
}

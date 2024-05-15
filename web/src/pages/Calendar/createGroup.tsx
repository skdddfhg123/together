import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import sendToast from '@hooks/useToast';
import * as CALENDAR from '@services/calendarAPI';

export default function CreateGroupPage() {
  const titleRef = useRef<HTMLInputElement>(null);
  const [groupType, setGroupType] = useState<string>('#123456'); //TODO color로 변경?
  const navigate = useNavigate();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const groupTitle = titleRef.current?.value;
    if (!groupTitle) return sendToast('default', '생성할 그룹명을 입력해주세요.');

    const res = await CALENDAR.createGroupCalendar({
      title: groupTitle,
      type: groupType, //TODO color로 변경?
    });
    if (!res) throw new Error('그룹 캘린더 생성 실패');

    sendToast('success', '그룹 캘린더가 생성되었습니다.');
    navigate('/main');
  };

  return (
    <div className={`FLEX-horizC h-128`}>
      <h1 className={`m-10`}>캘린더 만들기 페이지</h1>
      <form className="FLEX-horizC h-5/6" onSubmit={submitForm}>
        <fieldset className={`FLEX-horizC`}>
          {/* <section className={`w-full mb-5 text-xl flex justify-center`}>
            <label className={`p-2 mx-4`}>
              <input
                className={`mr-2`}
                type="radio"
                name="groupType"
                onChange={() => setGroupType('private')}
                value="Private"
                defaultChecked
              />
              Private
            </label>
            <label className={`p-2 mx-4`}>
              <input
                className={`mr-2`}
                type="radio"
                name="groupType"
                onChange={() => setGroupType('public')}
                value="Public"
              />
              Public
            </label>
          </section> */}
          <label>
            <input className={`SIGN-input`} type="text" ref={titleRef} />
          </label>
        </fieldset>
        <div className="FLEX-verC w-full m-5">
          <Link className={`p-4 mx-4`} to="/main">
            뒤로가기
          </Link>
          <button className={`p-4 mx-4`} type="submit">
            캘린더 만들기
          </button>
        </div>
      </form>
    </div>
  );
}

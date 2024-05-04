import React, { useState, useRef } from 'react';
import * as CALENDAR from '@services/calendarAPI';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateGroupPage() {
  const titleRef = useRef<HTMLInputElement>(null);
  const [groupType, setGroupType] = useState<'public' | 'private'>('private');
  const navigate = useNavigate();

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const groupTitle = titleRef.current?.value;
    if (!groupTitle) {
      alert('생성할 그룹명을 입력해주세요.');
      return;
    }

    try {
      const res = await CALENDAR.createGroupCalendar({
        title: groupTitle,
        type: groupType,
      });
      if (!res) throw new Error('그룹 캘린더 생성 실패');
      alert('그룹 생성 성공');
      navigate('/main');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`h-128 flex flex-col items-center`}>
      <h1 className={`m-10`}>캘린더 만들기 페이지</h1>
      <form className="h-5/6 flex flex-col items-center justify-center">
        <fieldset className={`flex flex-col items-center`}>
          <section className={`w-full mb-5 text-xl flex flex-row justify-center`}>
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
          </section>
          <label>
            <input className={`formInput`} type="text" ref={titleRef} />
          </label>
        </fieldset>
        <div className="w-full m-5 flex justify-center">
          <Link className={`p-4 mx-4`} to="/main">
            뒤로가기
          </Link>
          <button className={`p-4 mx-4`} type="button" onClick={submitForm}>
            캘린더 만들기
          </button>
        </div>
      </form>
    </div>
  );
}

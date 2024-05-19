import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Tooltip } from 'react-tooltip';
import { format } from 'date-fns';

import { useSelectedDayStore } from '@store/index';
import { MemberWithEvent } from '@type/index';

import MemberTimeline from '@components/Event/ViewEvent/DetailWithMemberModal/MemberTimeLine';
import '@styles/modalStyle.css';

import default_user from '@assets/default_user.png';

interface EventDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  memberEventList: MemberWithEvent[];
}

export default function EventDetailsWithMemberModal({
  isOpen,
  onClose,
  memberEventList,
}: EventDetailsModal) {
  const colors = ['#004080', '#0080ff', '#00bfff', '#40e0d0'];
  const { selectedDay } = useSelectedDayStore();
  const [currentDay, setCurrentDay] = useState<Date>(selectedDay || new Date());

  const handlePrevDay = () => {
    const prevDay = new Date(currentDay);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDay(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDay);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDay(nextDay);
  };

  //****************? 초기화 함수
  useEffect(() => {
    if (selectedDay) {
      setCurrentDay(selectedDay);
    }
  }, [selectedDay]);

  return (
    <Modal
      className="dayMemberEventModal"
      overlayClassName="dayMemberEventOverlay"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className="p-5 bg-white rounded-lg w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button className="ANI-btn p-1 text-2xl font-bold rounded-xl" onClick={handlePrevDay}>
            &lt; 이전
          </button>
          <h1 className="text-center text-5xl font-bold">{`< ${format(currentDay, 'yy년 MM월 dd일')} > 멤버 상세 일정`}</h1>
          <button className="ANI-btn p-1 text-2xl font-bold rounded-xl" onClick={handleNextDay}>
            다음 &gt;
          </button>
        </div>
        <div className="bg-blue-50 w-full p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-16"></div>
            <div className="relative w-full">
              <div className="relative top-0 left-0 w-full flex justify-between text-xl font-bold bg-blue-600 text-white py-2 rounded-t-lg">
                {Array.from({ length: 25 }, (_, i) => (
                  <span key={i} className="flex-1 text-center">
                    {i}
                  </span>
                ))}
              </div>
              <div
                className="relative top-0 left-0 w-full h-full border-l border-blue-300"
                style={{ marginLeft: '8%', marginTop: '20px' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="border-r border-blue-300"
                    style={{
                      height: '100%',
                      width: 'calc(100% / 12)',
                      position: 'absolute',
                      left: `calc(${((i + 1) * 100) / 12}% - 1px)`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          {memberEventList.map((member, index) => (
            <div key={member.useremail} className="flex items-center mb-10 mt-10">
              <img
                data-tooltip-id={`tooltip-user-${index}`}
                src={member.thumbnail ?? default_user}
                alt={member.nickname}
                className="w-12 h-12 rounded-full border-4"
                style={{ borderColor: colors[index % colors.length] }}
              />
              <div className="w-full ml-4">
                <MemberTimeline
                  memberEvents={member}
                  color={colors[index % colors.length]}
                  currentDay={currentDay}
                />
                <Tooltip id={`tooltip-user-${index}`} className="tooltip-box">
                  <div className="tooltip-content flex items-center p-3">
                    <img
                      src={member.thumbnail ? member.thumbnail : default_user}
                      alt={member.nickname}
                      className="w-48 h-48 rounded-full mr-4"
                    />
                    <div className="text-4xl">{member.nickname}</div>
                  </div>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
import { DefaultEvent, MemberWithEvent } from '@type/index';
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const TimeBar = ({ startAt, endAt, color }: { startAt: string, endAt: string, color: string }) => {
  const utcStartDate = new Date(startAt);
  const utcEndDate = new Date(endAt);

  const startHours = utcStartDate.getUTCHours();
  const startMinutes = utcStartDate.getUTCMinutes();
  const endHours = utcEndDate.getUTCHours();
  const endMinutes = utcEndDate.getUTCMinutes();

  const startTime = startHours + startMinutes / 60;
  let endTime = endHours + endMinutes / 60;

  if (endTime > 24) endTime = 24; // 하루를 넘어가는 경우 조정

  const width = `${((endTime - startTime) / 24) * 100}%`;
  const leftPosition = `${(startTime / 24) * 100}%`;

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formattedStartAt = formatTime(startHours, startMinutes);
  const formattedEndAt = formatTime(endHours, endMinutes);

  return (
    <div style={{ position: 'absolute', left: leftPosition, width, backgroundColor: color, top: '50%', transform: 'translateY(-50%)' }} className="h-2 flex items-center group">
      <span className="absolute left-0 transform -translate-x-1/2 h-6 w-0.5 rounded-full" style={{ backgroundColor: color }}></span>
      <span className="absolute right-0 transform translate-x-1/2 h-6 w-0.5 rounded-full" style={{ backgroundColor: color }}></span>
      <div className="hidden group-hover:flex absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-800 shadow-md whitespace-nowrap">
        {formattedStartAt} ~ {formattedEndAt}
      </div>
    </div>
  );
};

const MemberTimeline = ({ memberEvents, color, selectedDate }: { memberEvents: MemberWithEvent, color: string, selectedDate: string }) => {
  // 선택된 날짜를 UTC 기준으로 파싱
  const selectedDateObj = new Date(selectedDate + 'T00:00:00.000Z');
  const formattedSelectedDate = selectedDateObj.toISOString().slice(0, 10);
  let events = memberEvents.groupedEvent[formattedSelectedDate] ?? [];

  console.log(events);
  // 시간 순으로 정렬
  events.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  let mergedEvents = [];
  let lastEvent = null;

  for (let event of events) {
    if (lastEvent == null) {
      lastEvent = { ...event };
    } else {
      const lastEndTime = new Date(lastEvent.endAt).getTime();
      const currentStartTime = new Date(event.startAt).getTime();

      if (currentStartTime <= lastEndTime) {
        const currentEndTime = new Date(event.endAt).getTime();
        if (currentEndTime > lastEndTime) {
          lastEvent.endAt = event.endAt;
        }
      } else {
        mergedEvents.push(lastEvent);
        lastEvent = { ...event };
      }
    }
  }
  if (lastEvent != null) {
    mergedEvents.push(lastEvent);
  }
  console.log(mergedEvents);

  // 일정 조정: 이벤트 시작과 종료를 선택된 날짜의 경계에 맞춤
  const finalEvents = mergedEvents.map(event => {
    const eventStart = new Date(event.startAt);
    const eventEnd = new Date(event.endAt);
    const dayStart = new Date(selectedDateObj);
    const dayEnd = new Date(selectedDateObj);
    dayEnd.setUTCHours(23, 59, 59, 999);

    let adjustedStart = eventStart < dayStart ? dayStart : eventStart;
    let adjustedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

    return {
      ...event,
      startAt: adjustedStart.toISOString(),
      endAt: adjustedEnd.toISOString()
    };
  }).filter(event => {
    const eventStart = new Date(event.startAt).getTime();
    const eventEnd = new Date(event.endAt).getTime();
    return eventStart < eventEnd;
  });

  console.log(finalEvents);

  return (
    <div className="relative h-12 w-full mt-2">
      <span className="absolute top-1/2 w-full border-t border-dashed border-gray-400 transform -translate-y-1/2"></span>
      {finalEvents.map((event, index) => (
        <TimeBar key={`current-${index}`} startAt={event.startAt} endAt={event.endAt} color={color} />
      ))}
    </div>
  );
};

const EventTimeline1 = ({ members, initialDate }: { members: MemberWithEvent[], initialDate: string }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const colors = ['#004080', '#0080ff', '#00bfff', '#40e0d0'];

  const handlePrevDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-5 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <button onClick={handlePrevDay}>&lt; 이전</button>
        <h1 className="text-center text-2xl font-bold">{formattedSelectedDate} 멤버 상세 일정</h1>
        <button onClick={handleNextDay}>다음 &gt;</button>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <div className="w-16"></div>
          <div className="relative w-full">
            <div className="absolute top-0 left-0 w-full flex justify-between text-xs font-bold bg-blue-600 text-white py-1 rounded-t-lg">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className="flex-1 text-center">{i}</span>
              ))}
            </div>
            <div className="absolute top-0 left-0 w-full h-full border-l border-blue-300" style={{ marginLeft: '8%' }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="border-r border-blue-300" style={{ height: '100%', width: 'calc(100% / 12)', position: 'absolute', left: `calc(${(i + 1) * 100 / 12}% - 1px)` }}></div>
              ))}
            </div>
          </div>
        </div>
        {members.map((member, index) => (
          <div key={member.useremail} className="flex items-center mb-10 mt-10">
            <img src={member.thumbnail ?? undefined} alt={member.nickname} className="w-12 h-12 rounded-full border-4" style={{ borderColor: colors[index % colors.length] }} />
            <div className="w-full ml-4">
              <MemberTimeline memberEvents={member} color={colors[index % colors.length]} selectedDate={selectedDate.toISOString().slice(0, 10)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestPage: React.FC = () => {
  const mockMemberData: any = [
    {
      "useremail": "member1@example.com",
      "nickname": "곰돌",
      "thumbnail": "https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/54d89369-1723-4026-a786-5b79c3a827bb.png",
      "groupedEvent": {
        "2024-05-14": [
          {
            "title": "5월 14일부터 15일까지 일정",
            "startAt": "2024-05-14T00:00:00.000Z",
            "endAt": "2024-05-15T23:59:59.999Z"
          }
        ],
        "2024-05-15": [
          {
            "title": "5월 14일부터 15일까지 일정",
            "startAt": "2024-05-14T00:00:00.000Z",
            "endAt": "2024-05-15T23:59:59.999Z"
          }
        ],
        "2024-05-16": [
          {
            "title": "5월 16일 일정",
            "startAt": "2024-05-16T00:00:00.000Z",
            "endAt": "2024-05-16T23:59:59.999Z"
          }
        ]
      }
    },
    {
      "useremail": "member2@example.com",
      "nickname": "호랑이",
      "thumbnail": "https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/54d89369-1723-4026-a786-5b79c3a827bb.png",
      "groupedEvent": {
        "2024-05-15": [
          {
            "title": "5월 15일 오전 회의",
            "startAt": "2024-05-15T09:00:00.000Z",
            "endAt": "2024-05-15T10:00:00.000Z"
          },
          {
            "title": "5월 15일 오후 회의",
            "startAt": "2024-05-15T13:00:00.000Z",
            "endAt": "2024-05-15T15:00:00.000Z"
          }
        ]
      }
    },
    {
      "useremail": "member3@example.com",
      "nickname": "사슴",
      "thumbnail": "https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/54d89369-1723-4026-a786-5b79c3a827bb.png",
      "groupedEvent": {
        "2024-05-15": [
          {
            "title": "5월 15일부터 16일까지 워크숍",
            "startAt": "2024-05-15T08:00:00.000Z",
            "endAt": "2024-05-16T18:00:00.000Z"
          }
        ]
      }
    },
    {
      "useremail": "member3@example.com",
      "nickname": "자다가 일어남",
      "thumbnail": "https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/54d89369-1723-4026-a786-5b79c3a827bb.png",
      "groupedEvent": {
        "2024-05-15": [
          {
            "title": "5월 14일부터 16일까지 워크숍",
            "startAt": "2024-05-14T08:00:00.000Z",
            "endAt": "2024-05-16T18:00:00.000Z"
          }
        ]
      }
    },
    {
      "useremail": "member4@example.com",
      "nickname": "토끼",
      "thumbnail": "https://jungle-toogether.s3.ap-northeast-2.amazonaws.com/profiles/54d89369-1723-4026-a786-5b79c3a827bb.png",
      "groupedEvent": {
        "2024-05-14": [
          {
            "title": "프로젝트 회의",
            "startAt": "2024-05-14T10:00:00.000Z",
            "endAt": "2024-05-14T12:00:00.000Z"
          }
        ],
        "2024-05-15": [
          {
            "title": "팀 빌딩 워크숍",
            "startAt": "2024-05-15T09:00:00.000Z",
            "endAt": "2024-05-15T17:00:00.000Z"
          }
        ],
        "2024-05-16": [
          {
            "title": "종합 보고서 준비",
            "startAt": "2024-05-16T08:00:00.000Z",
            "endAt": "2024-05-16T16:00:00.000Z"
          }
        ]
      }
    }
  ];

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <EventTimeline1 members={mockMemberData} initialDate={today} />
    </div>
  );
};

export default TestPage;

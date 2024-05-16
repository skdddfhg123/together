import React, { useEffect, useState, useCallback } from 'react';

import useToggle from '@hooks/useToggle';
import * as FEED from '@services/eventFeedAPI';
import { EventFeed } from '@type/index';

import * as CALENDAR from '@services/calendarAPI';

import MiniCalendar from '@components/Canlendar/MiniCalendar';
import FeedModal from '@components/Feed/FeedModal';
import { useSelectedCalendarStore } from '@store/index';

import useToast from '@hooks/useToast';

interface FeedPageProps {
  isPrevMonth: boolean;
  isNextMonth: boolean;
  currentMonth: Date;
  onClose: () => void;
}

export default function FeedPage({
  isPrevMonth,
  isNextMonth,
  currentMonth,
  onClose,
}: FeedPageProps) {
  const { isOn, toggle } = useToggle(false);

  const [feedList, setFeedList] = useState<EventFeed[]>([]);
  const [selectedFeedInfo, setSelectedFeedInfo] = useState<EventFeed | null>(null);
  const { selectedCalendar } = useSelectedCalendarStore();

  //************ 피드 모달
  const openFeedModal = useCallback((feedInfo: EventFeed | null) => {
    setSelectedFeedInfo(feedInfo);
    toggle();
  }, []);

  const closeFeedModal = useCallback(() => {
    setSelectedFeedInfo(null);
    toggle();
  }, []);

  //******************? 컴포넌트 초기화
  const fetchCalendarList = async () => {
    await CALENDAR.getMyAllCalendar();
  };

  const fetchFeedList = async () => {
    if (selectedCalendar === 'All') {
      useToast('warning', '그룹 캘린더를 선택해주세요.');
      onClose();
      return;
    }

    const res = await FEED.getAllFeedInCalnedar(selectedCalendar.calendarId);
    setFeedList(res);
  };

  useEffect(() => {
    fetchCalendarList();
    fetchFeedList();
  }, [selectedCalendar]);

  return (
    <>
      <div className="FLEX-ver flex-grow">
        <nav className="FLEX-horiz w-100 border-r">
          <section key="calendar-section" className="h-2/5 my-5 border-b">
            <MiniCalendar
              isPrevMonth={isPrevMonth}
              isNextMonth={isNextMonth}
              currentMonth={currentMonth}
              nowCalendar={selectedCalendar}
              setFeedList={setFeedList}
            />
          </section>

          <section key="groupList-section" className="FLEX-horiz flex-grow SCROLL-hide">
            <h2 className="mx-auto">카테고리</h2>
            {/* <ul className="grid grid-cols-1 mx-3 gap-3">
              {calendarList.map((calendar: Calendar, idx) => (
                <li
                  className="FLEX-ver items-center gap-5 hover:cursor-pointer"
                  key={calendar.calendarId}
                  onClick={() => {
                    fetchFeedList();
                    setSelectedCalendar(calendar);
                  }}
                >
                  <img
                    className="w-20 h-20 object-cover "
                    src={calendar.coverImage?.imageSrc || defaultCover}
                    alt={`달력 ${idx}번`}
                  />
                  <div>{calendar.title}</div>
                </li>
              ))}
            </ul> */}
          </section>
        </nav>
        <main className="flex-grow">
          {/* <div className="h-1/8">
            피드 리스트
            <button onClick={fetchCalendarList}>리스트 받아오기</button>
          </div> */}
          <h1
            className="text-center m-2 hover:text-custom-main hover:cursor-pointer"
            onClick={fetchFeedList}
          >
            {selectedCalendar !== 'All' && selectedCalendar.title}의 피드
          </h1>
          <div id="mainFeed" className="FLEX-horiz SCROLL-hide h-200 mx-auto">
            {feedList.length > 0 ? (
              <ul className="grid grid-cols-3 p-0.5 w-full">
                {feedList.map((feed: EventFeed, idx: number) => (
                  <li
                    key={idx}
                    className="hover:HOVERING flex justify-center items-center m-0.5 border rounded"
                  >
                    {feed.images && (
                      <img
                        className="w-80 h-80 object-cover"
                        src={feed.images[0].imageSrc}
                        alt={`Feed ${idx}`}
                        onClick={() => openFeedModal(feed)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="FLEX-horizC w-full h-full">
                <div className="text-3xl">등록된 피드가 없습니다.</div>
              </div>
            )}
          </div>
        </main>
        <FeedModal feedInfo={selectedFeedInfo} isOpen={isOn} onClose={closeFeedModal} />
      </div>
    </>
  );
}

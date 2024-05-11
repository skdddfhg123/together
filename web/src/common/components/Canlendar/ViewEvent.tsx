import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { UUID } from 'crypto';

import { GroupEvent } from '@type/index';
import * as CALENDAR from '@services/calendarAPI';
import * as FEED from '@services/eventFeedAPI';

import CreateFeedModal from '@components/Feed/CreateFeed/CreateFeedModal';
import EventFeedList from '@components/Canlendar/EventFeedList';
import { useGroupEventInfoStore, useSelectedCalendarStore } from '@store/index';

interface ViewEventProps {
  eventId: UUID | null;
  onClose: () => void;
  deleteEvent: () => void;
  setEdit: () => void;
}

export default function ViewEvent({ eventId, onClose, deleteEvent, setEdit }: ViewEventProps) {
  const eventInfo = useGroupEventInfoStore().groupEventInfo;
  const { selectedCalendar } = useSelectedCalendarStore();
  const [feedCreate, setFeedCreate] = useState<boolean>(false);

  // *********************? 함수
  const closeFeedCreateModal = useCallback(() => setFeedCreate(false), []);

  const displayDate = (dateString?: string) => {
    if (!dateString) return { year: '', monthDay: '' };

    const date = parseISO(dateString);
    const year = format(date, 'yyyy');
    const monthDay = format(date, 'MM-dd');
    return { year, monthDay };
  };

  // *********************? 최초 Render
  useEffect(() => {
    const fetchEventFeedList = async (groupEventId: UUID) => {
      await FEED.getAllFeedInEvent(groupEventId);
    };

    if (eventId) fetchEventFeedList(eventId);
  }, [eventId]);

  return (
    <>
      <nav className="FLEX-verB h-fit mx-2 my-1">
        <button className="p-2 hover:bg-custom-light rounded" onClick={onClose}>
          닫기
        </button>
        <div className="space-x-1">
          <button className="p-2  hover:bg-custom-light rounded" onClick={deleteEvent}>
            삭제
          </button>
          <button className="p-2 hover:bg-custom-light rounded" onClick={setEdit}>
            수정
          </button>
          <button
            className="BTN hover:bg-custom-light rounded"
            onClick={() => setFeedCreate(!feedCreate)}
          >
            피드 등록
            <CreateFeedModal
              groupEventId={eventInfo?.groupEventId || null}
              isOpen={feedCreate}
              onClose={closeFeedCreateModal}
            />
          </button>
        </div>
      </nav>
      <header className="FLEX-horizC h-auto p-4 justify-end">
        {selectedCalendar === 'All' ? <>{eventInfo?.groupCalendarTitle}</> : <></>}
        {eventInfo?.author?.thumbnail ? (
          <img className="w-36" src={`${eventInfo?.author.thumbnail}`}></img>
        ) : (
          <>{eventInfo?.author?.nickname}</>
        )}

        <h2
          className="w-80 p-3 mx-auto text-3xl text-center rounded"
          style={{ backgroundColor: `${eventInfo?.color}` }}
        >
          {eventInfo?.title}
        </h2>
      </header>
      <main>
        <section key="date-section" className="FLEX-verA items-center p-4">
          <div className="FLEX-horizC">
            <div>{displayDate(eventInfo?.startAt).year}</div>
            <h2>{displayDate(eventInfo?.startAt).monthDay}</h2>
          </div>
          <h1 className="text-custom-main">{'>'}</h1>
          <div className="FLEX-horizC">
            <div>{displayDate(eventInfo?.endAt).year}</div>
            <h2>{displayDate(eventInfo?.endAt).monthDay}</h2>
          </div>
        </section>
        <section key="detail-section" className="FLEX-verC space-x-4 py-4">
          <span>
            {'멤버 : '}
            {eventInfo?.members && eventInfo?.members.length > 0
              ? eventInfo?.members.map((mem) => (
                  <span key={mem.useremail}>{`${mem.nickname}`}</span>
                ))
              : '없음'}
          </span>
          <span>
            {'중요 : '}
            {eventInfo?.pinned ? 'Yes' : 'No'}
          </span>
        </section>
      </main>
      <EventFeedList />
    </>
  );
}

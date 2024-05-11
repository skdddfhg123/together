import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { UUID } from 'crypto';

import * as FEED from '@services/eventFeedAPI';
import { AllEvent, Calendar, CalendarId, GroupEvent, Member } from '@type/index';
import {
  useGroupEventInfoStore,
  useCalendarListStore,
  useSelectedCalendarStore,
  useAllEventListStore,
} from '@store/index';

import CreateFeedModal from '@components/Feed/CreateFeed/CreateFeedModal';
import EventFeedList from '@components/Canlendar/EventFeedList';
import EventMember from '@components/Canlendar/EventMember';

import default_user from '@assets/default_user.png';

interface ViewEventProps {
  eventId: UUID | null;
  onClose: () => void;
  deleteEvent: (groupEventId: UUID | null) => void;
  setEdit: () => void;
}

export default function ViewEvent({ eventId, onClose, deleteEvent, setEdit }: ViewEventProps) {
  const eventInfo = useGroupEventInfoStore().groupEventInfo;
  const calendarList = useCalendarListStore().calendarList;
  const { AllEventList } = useAllEventListStore();
  const { selectedCalendar } = useSelectedCalendarStore();
  const [feedCreate, setFeedCreate] = useState<boolean>(false);

  const calendarMember = useMemo(() => {
    if (selectedCalendar === 'All') return [];

    const calendar = calendarList.find(
      (calendar) => calendar.calendarId === selectedCalendar.calendarId,
    );
    return calendar ? calendar.attendees : [];
  }, [selectedCalendar, calendarList]);

  // *********************? 함수
  const closeFeedCreateModal = useCallback(() => setFeedCreate(false), []);

  const displayDate = (dateString?: string) => {
    if (!dateString) return { year: '', monthDay: '' };

    const date = parseISO(dateString);
    const year = format(date, 'yyyy');
    const monthDay = format(date, 'MM-dd');
    return { year, monthDay };
  };

  const renderAuthorOrGroupTitle = ({
    eventInfo,
    calendarMember,
    AllEventList,
    selectedCalendar,
  }: {
    eventInfo: GroupEvent;
    calendarMember: Member[];
    AllEventList: AllEvent[];
    selectedCalendar: Calendar | 'All';
  }) => {
    if (selectedCalendar === 'All') {
      const matchingEvent = AllEventList.find((event) => event.id === eventInfo.groupEventId);
      return (
        <div className="mb-2 text-xl text-gray-600">
          {matchingEvent ? matchingEvent.group : 'Event not found'}
        </div>
      );
    } else {
      const matchingMember = calendarMember.find(
        (member) => member.useremail === eventInfo?.author,
      );
      return (
        <div className="FLEX-verC items-center mb-2 text-gray-600">
          {matchingMember ? (
            <>
              <img
                className="w-8 mr-2"
                src={matchingMember.thumbnail || default_user}
                alt={matchingMember.nickname}
              />
              <p>{matchingMember.nickname}</p>
            </>
          ) : (
            <></>
          )}
        </div>
      );
    }
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
      <div className="h-fit space-y-3 pb-2 rounded">
        <nav className="FLEX-verB p-2">
          <button className="p-1 hover:bg-custom-light rounded" onClick={onClose}>
            닫기
          </button>

          <div className="space-x-2">
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
            <button
              disabled={selectedCalendar === 'All'}
              className={`BTN hover:bg-custom-light rounded 
            ${selectedCalendar === 'All' ? 'text-gray-400 cursor-not-allowed' : ''}`}
              onClick={setEdit}
            >
              수정
            </button>
            <button
              className="BTN hover:bg-custom-light rounded"
              onClick={() => deleteEvent(eventId)}
            >
              삭제
            </button>
          </div>
        </nav>
        <header className="FLEX-horizC justify-en">
          {eventInfo &&
            renderAuthorOrGroupTitle({ eventInfo, calendarMember, AllEventList, selectedCalendar })}
          <h2
            className="w-11/12 py-2 mx-2 text-3xl text-center rounded"
            style={{ backgroundColor: `${eventInfo?.color}` }}
          >
            {eventInfo?.title}
          </h2>
        </header>
        <main className="space-y-4">
          <section key="date-section" className="FLEX-verA items-center">
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
          <section key="member-section" className="FLEX-horizC items-center space-y-2">
            <EventMember
              eventInfo={eventInfo}
              calendarMember={calendarMember}
              selectedCalendar={selectedCalendar}
            />
          </section>
        </main>
      </div>
      <EventFeedList />
    </>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { UUID } from 'crypto';

import * as FEED from '@services/eventFeedAPI';
import { AllEvent, Calendar, GroupEvent, Member } from '@type/index';
import {
  useGroupEventInfoStore,
  useCalendarListStore,
  useSelectedCalendarStore,
  useAllEventListStore,
} from '@store/index';

import { hexToRgba } from '@hooks/useHexToRgba';

import CreateFeedModal from '@components/Feed/CreateFeed/CreateFeedModal';
import EventFeedList from '@components/Feed/EventFeedList';
import EventMember from '@components/Event/ViewEvent/EventMember';

import default_user from '@assets/default_user.png';

interface ViewEventProps {
  eventId: UUID | null;
  onClose: () => void;
  deleteEvent: (groupEventId: UUID | null) => void;
  setEdit: () => void;
}

export default function ViewEvent({ eventId, onClose, deleteEvent, setEdit }: ViewEventProps) {
  const eventInfo = useGroupEventInfoStore().groupEventInfo;
  const { calendarList } = useCalendarListStore();
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
        <>
          <div className="mb-2 text-xl text-gray-600">
            {matchingEvent ? matchingEvent.group : 'Event not found'}
          </div>
          <h2
            className="w-11/12 py-2 mx-2 text-3xl text-center rounded"
            style={{
              backgroundColor: `${matchingEvent?.type && hexToRgba(matchingEvent.type)}`,
            }}
          >
            {eventInfo?.title}
          </h2>
        </>
      );
    } else {
      const matchingMember = calendarMember.find(
        (member) => member.useremail === eventInfo?.author,
      );
      return (
        <>
          <div className="FLEX-verC items-center mb-2 text-gray-600">
            {matchingMember ? (
              <>
                <img
                  className="max-w-8 max-h-8 rounded-full mr-2"
                  src={matchingMember.thumbnail || default_user}
                  alt={matchingMember.nickname}
                />
                <p>{matchingMember.nickname}</p>
              </>
            ) : (
              <></>
            )}
          </div>
          <h2
            className="w-11/12 py-2 mx-2 text-3xl text-center rounded"
            style={{
              backgroundColor: `${eventInfo?.color}`,
            }}
          >
            {eventInfo?.title}
          </h2>
        </>
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
              disabled={selectedCalendar === 'All'}
              className={`BTN hover:bg-custom-light rounded 
              ${selectedCalendar === 'All' ? 'text-gray-400 cursor-not-allowed' : ''}`}
              onClick={() => deleteEvent(eventId)}
            >
              삭제
            </button>
          </div>
          <button className="text-3xl rounded" onClick={onClose}>
            &times;
          </button>
        </nav>
        <header className="FLEX-horizC justify-en">
          {eventInfo &&
            renderAuthorOrGroupTitle({ eventInfo, calendarMember, AllEventList, selectedCalendar })}
        </header>
        <main className="space-y-4">
          <section key="date-section" className="FLEX-verA items-center my-5">
            {eventInfo?.startAt && (
              <div className="FLEX-horizC">
                <div>{format(new Date(eventInfo.startAt), 'yyyy년 MM월 dd일')}</div>
                <div className="text-2xl font-bold">
                  {format(new Date(eventInfo.startAt), 'HH시 mm분')}
                </div>
              </div>
            )}
            <h1 className="text-custom-main">{'>'}</h1>
            {eventInfo?.startAt && (
              <div className="FLEX-horizC">
                <div>{format(new Date(eventInfo.endAt), 'yyyy년 MM월 dd일')}</div>
                <div className="text-2xl font-bold">
                  {format(new Date(eventInfo.endAt), 'HH시 mm분')}
                </div>
              </div>
            )}
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

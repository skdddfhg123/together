import React, { useMemo } from 'react';
import { useGroupEventStore } from '@store/index';

interface EventDetailsProps {
  isOpen: boolean;
  eventId: string | null;
  onClose: () => void;
}

export default React.memo(function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
  const groupEvents = useGroupEventStore((state) => state.groupEvents);

  const groupEvent = useMemo(() => {
    return groupEvents.find((event) => event.groupEventId === eventId);
  }, [eventId, groupEvents]);

  console.log(`groupEvent 찾아보자`, groupEvent);

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-100' : 'w-0'}`}
    >
      {isOpen && (
        <>
          <button onClick={onClose}>Close</button>
          <section className="w-100" id={`${isOpen ? 'slideIn-right' : 'slideOut-right'}`}>
            <div>일정 이름 : {groupEvent?.title}</div>
            <div>작성자 : {groupEvent?.author}</div>
            <div>{groupEvent?.color}</div>
            <div>시작 날짜 : {groupEvent?.startAt}</div>
            <div>종료 날짜 : {groupEvent?.endAt}</div>
            <div>
              공유할 멤버 :
              {groupEvent?.member.length
                ? groupEvent.member.map((mem, idx) => <div key={idx}>{mem}</div>)
                : ' 멤버가 없습니다.'}
            </div>
            <div> 북마크 : {groupEvent?.pinned ? 'true' : 'false'}</div>
          </section>
        </>
      )}
    </div>
  );
});

import React, { useEffect, useCallback } from 'react';
import { UUID } from 'crypto';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';
import useToggle from '@hooks/useToggle';

import ViewEvent from '@components/Canlendar/ViewEvent';
import ModifyEvent from '@components/Canlendar/ModifyEvent';
import { useGroupEventInfoStore, useSelectedCalendarStore } from '@store/index';
import { GroupEvent } from '@type/index';

interface EventDetailsProps {
  isOpen: boolean;
  eventId: UUID | null;
  onClose: () => void;
}

export default function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
  const { isOn, toggle } = useToggle(true);

  const { selectedCalendar } = useSelectedCalendarStore();
  const { isLoaded, setIsLoaded } = useGroupEventInfoStore();

  // *********************? 함수
  const deleteEvent = useCallback(async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    await CALENDAR.removeGroupEvent(eventId);
  }, []);

  const submitModifyEvent = async (formData: GroupEvent) => {
    await CALENDAR.updateGroupEvent(formData);

    if (selectedCalendar === 'All') return await USER.firstRender();

    await CALENDAR.getGroupAllEvents(selectedCalendar.calendarId);
    onClose();
  };

  // *********************? 최초 Render
  useEffect(() => {
    const fetchEventInfo = async () => {
      if (eventId) await CALENDAR.getGroupOneEvent(eventId);
    };

    if (eventId || !isLoaded) fetchEventInfo();
    setIsLoaded(true);
  }, [eventId, isLoaded]);

  // 그룹 캘린더 변경 시 자동으로 닫히기
  useEffect(() => onClose(), [selectedCalendar]);

  return (
    <div
      id={`${isOpen ? 'SLIDEdetailIn-right' : 'SLIDEdetailOut-right'}`}
      className={`h-full SCROLL-hide ${isOpen ? 'event-detail' : ''}`}
    >
      {isOn ? (
        <ViewEvent eventId={eventId} onClose={onClose} deleteEvent={deleteEvent} setEdit={toggle} />
      ) : (
        <ModifyEvent
          eventId={eventId}
          setView={toggle}
          onClose={onClose}
          onSubmit={submitModifyEvent}
        />
      )}
    </div>
  );
}

import React, { useEffect, useCallback } from 'react';
import { UUID } from 'crypto';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';
import * as REDIS from '@services/redisAPI';

import { Calendar, GroupEvent } from '@type/index';
import { useGroupEventInfoStore, useSelectedCalendarStore } from '@store/index';
import useToggle from '@hooks/useToggle';
import useToast from '@hooks/useToast';

import ViewEvent from '@components/Event/ViewEvent/ViewEvent';
import ModifyEvent from '@components/Event/ModifyEvent';

interface EventDetailsProps {
  isOpen: boolean;
  eventId: UUID | null;
  onClose: () => void;
}

export default function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
  const { isOn, toggle } = useToggle(true);

  const { selectedCalendar, setSelectedCalendar } = useSelectedCalendarStore();
  const { isLoaded, setIsLoaded } = useGroupEventInfoStore();

  // *********************? 함수
  const handleRender = async () => {
    if (selectedCalendar === 'All') {
      await USER.firstRender();
      onClose();
      return;
    }
    const res: Calendar = await CALENDAR.getGroupAllEvents(selectedCalendar);
    if (res) {
      //TODO bannerImage 업데이트 안됨
      setSelectedCalendar({ ...selectedCalendar, bannerImg: res.bannerImg });
    }

    onClose();
  };

  const deleteEvent = useCallback(
    async (groupEventId: UUID | null) => {
      if (!window.confirm('정말 삭제하시겠습니까?')) return;
      await CALENDAR.removeGroupEvent(groupEventId);
      await REDIS.MessagePost({ method: `일정을 삭제` });
      handleRender();
    },
    [handleRender],
  );

  const submitModifyEvent = useCallback(async (formData: GroupEvent) => {
    await CALENDAR.updateGroupEvent(formData);
    await REDIS.MessagePost({ method: `일정을 수정` });
    handleRender();
  }, []);

  // *********************? 최초 Render
  useEffect(() => {
    if (!isOn) {
      useToast('warning', '수정을 먼저 완료해주세요.');
      return;
    }
    const fetchEventInfo = () => {
      if (eventId) CALENDAR.getGroupOneEvent(eventId);
    };

    if (eventId || !isLoaded) {
      fetchEventInfo();
      setIsLoaded(true);
    }
  }, [eventId, isLoaded]);

  useEffect(() => {
    onClose();
    if (!isOn) toggle();
  }, [selectedCalendar]);

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

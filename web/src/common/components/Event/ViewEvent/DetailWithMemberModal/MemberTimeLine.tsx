import React from 'react';

import { MemberWithEvent } from '@type/index';

import TimeBar from '@components/Event/ViewEvent/DetailWithMemberModal/MemberTimeBar';

interface MemberTimeLineProps {
  memberEvents: MemberWithEvent;
  color: string;
  selectedDate: string;
}

export default function MemberTimeline({ memberEvents, color, selectedDate }: MemberTimeLineProps) {
  const events = memberEvents.groupedEvent[selectedDate] ?? [];
  const mergedEvents = [];
  let lastEvent = null;

  events.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  for (const event of events) {
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

  const finalEvents = mergedEvents
    .map((event) => {
      const eventStart = new Date(event.startAt);
      const eventEnd = new Date(event.endAt);
      const dayStart = new Date(selectedDate);
      const dayEnd = new Date(selectedDate);
      dayEnd.setUTCHours(23, 59, 59, 999);

      const adjustedStart = eventStart < dayStart ? dayStart : eventStart;
      const adjustedEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

      return {
        ...event,
        startAt: adjustedStart.toISOString(),
        endAt: adjustedEnd.toISOString(),
      };
    })
    .filter((event) => {
      const eventStart = new Date(event.startAt).getTime();
      const eventEnd = new Date(event.endAt).getTime();
      return eventStart < eventEnd;
    });

  return (
    <div className="relative h-12 w-full mt-2">
      <span className="absolute top-1/2 w-full border-t border-dashed border-gray-400 transform -translate-y-1/2"></span>
      {finalEvents.map((event, index) => (
        <TimeBar
          key={`current-${index}`}
          startAt={event.startAt}
          endAt={event.endAt}
          color={color}
        />
      ))}
    </div>
  );
}

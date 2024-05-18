import React from 'react';
import { Tooltip } from 'react-tooltip';
import { getHours, getMinutes, format } from 'date-fns';

interface TimebarProps {
  startAt: Date;
  endAt: Date;
  color: string;
}

export default function TimeBar({ startAt, endAt, color }: TimebarProps) {
  const startHours = getHours(startAt);
  const startMinutes = getMinutes(startAt);
  const endHours = getHours(endAt);
  const endMinutes = getMinutes(endAt);

  const startTime = startHours + startMinutes / 60;
  let endTime = endHours + endMinutes / 60;

  if (endTime > 24) endTime = 24;

  const width = `${((endTime - startTime) / 24) * 100}%`;
  const leftPosition = `${(startTime / 24) * 100}%`;

  return (
    <div
      data-tooltip-id={`tooltip-time-${startAt.getTime()}`}
      style={{
        position: 'absolute',
        left: leftPosition,
        width,
        backgroundColor: color,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      className="h-6 flex items-center group"
    >
      <span
        className="absolute left-0 transform -translate-x-1/2 h-10 w-1 rounded-full"
        style={{ backgroundColor: color }}
      ></span>
      <span
        className="absolute right-0 transform translate-x-1/2 h-10 w-1 rounded-full"
        style={{ backgroundColor: color }}
      ></span>
      <Tooltip
        id={`tooltip-time-${startAt.getTime()}`}
        className="tooltip-box"
        place="top"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '23rem',
          height: '4rem',
          fontSize: '2.5rem',
          fontWeight: '600',
        }}
      >
        <div>{`${format(startAt, 'HH:mm')} ~ ${format(endAt, 'HH:mm')}`}</div>
      </Tooltip>
    </div>
  );
}

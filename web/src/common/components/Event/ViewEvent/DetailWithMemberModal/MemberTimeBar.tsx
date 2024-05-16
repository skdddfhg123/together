import React from 'react';
import { Tooltip } from 'react-tooltip';

interface TimebarProps {
  startAt: string;
  endAt: string;
  color: string;
}

export default function TimeBar({ startAt, endAt, color }: TimebarProps) {
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
    <div
      data-tooltip-id="tooltip-time"
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
      {/* <div className="hidden group-hover:flex absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-800 shadow-md whitespace-nowrap">
        {formattedStartAt} ~ {formattedEndAt}
      </div> */}
      <Tooltip
        id="tooltip-time"
        data-tooltip-class-name="tooltip-box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '23rem',
          height: '4rem',
          fontSize: '2.5rem',
          fontWeight: '600',
          // backgroundColor: '#0120c980',
        }}
      >
        <div>
          {formattedStartAt} ~ {formattedEndAt}
        </div>
      </Tooltip>
    </div>
  );
}

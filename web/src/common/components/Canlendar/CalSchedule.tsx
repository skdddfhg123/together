import React from 'react';

interface scheduleProps {
  schedule: any[];
  day: Date;
}

export default function CalSchedule({ schedule, day }: scheduleProps) {
  const Day: Date = day;
  return <div>{schedule.slice(0, 4)}</div>;
}

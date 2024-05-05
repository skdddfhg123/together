import React from 'react';
import '@styles/calendar.css';

interface scheduleProps {
  schedule: any[];
  day: Date;
}

export default function CalSchedule({ schedule, day }: scheduleProps) {
  const Day: Date = day;
  return <section className={`h-16 overflow-y-scroll hide-scrollbar`}>{schedule}</section>;
}

import React, { useState } from 'react';

import Calendar from './Calendar/calendar';

export default function Main() {
  const date: unknown = undefined;
  const [selectedDay, setSelectedDay] = useState<Date>(date as Date);
  return (
    <>
      <Calendar
        selectedDay={selectedDay}
        setSelectedDay={null}
        isPrevMonth
        isNextMonth
      />
    </>
  );
}

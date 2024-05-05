import React from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DayPickerCompProps {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
}

export default function DayPickerComp({ selectedDay, setSelectedDay }: DayPickerCompProps) {
  const [selected, setSelected] = React.useState<Date>();

  let footer = <p>Please pick a day.</p>;
  if (selectedDay) {
    footer = <p>You picked {format(selectedDay, 'PP')}.</p>;
  }
  return (
    <DayPicker
      mode="single"
      selected={selectedDay || undefined}
      onSelect={(day: Date | undefined) => setSelectedDay(day || null)}
      footer={footer}
    />
  );
}

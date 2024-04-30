import React, { useState } from 'react';
// import Schedule from './Schedule';

interface scheduleProps {
  day: Date;
  schedule: any[];
}

export default function CalSchedule({ schedule, day }: scheduleProps) {
  // const [story, setStory] = useState<any[]>([<Schedule key={0} />]);

  // const addStory = () => {
  //   setStory(story.concat(<Schedule key={story.length} />));
  // };

  const Day: Date = day;
  return <div>{schedule.slice(0, 4)}</div>;
}

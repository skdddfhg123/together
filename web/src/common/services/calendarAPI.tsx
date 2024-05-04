import * as API from '@utils/api';

import { useCalendarStore } from '@store/index';
import { CreateGroupForm } from '@type/index';

async function getCalEvents(calendarTitle: string) {
  console.log(`getcalevents : `, calendarTitle);
  let calendarID = null;
  if (calendarTitle === 'main') calendarID = sessionStorage.getItem('calendarID');
  else calendarID = sessionStorage.getItem(calendarTitle);
  const res = await API.get(`/calendar/group/get/${calendarID}`);
  console.log(res);
}

async function getAllCalendar() {
  const { setCalendars, setIsLoaded } = useCalendarStore.getState();

  const res = await API.get(`/calendar/get_calendar`);
  if (!res) throw new Error('캘린더 전체 받아오기 실패');
  console.log('캘린더 전체 받아오기 :', res); //debug//

  setCalendars(res.data);
  setIsLoaded(true);

  if (Array.isArray(res.data) && res.data) {
    res.data.forEach((data, idx) => {
      sessionStorage.setItem(`${data.title} - ${idx}`, data.calendarId);
    });
  }
  return true;
}

async function createGroupCalendar({ title, type }: CreateGroupForm) {
  const setType = type;
  const res = await API.post(`/calendar/create`, {
    title: title,
    type: setType,
  });
  if (!res) throw new Error('캘린더 생성 실패');
  console.log(`캘린더 생성`, res);
  return res;
}

export { getCalEvents, getAllCalendar, createGroupCalendar };

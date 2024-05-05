import * as API from '@utils/api';

import { useCalendarListStore, useGroupEventStore, reqGroupEvent } from '@store/index';
import { CreateGroupForm } from '@type/index';

export async function getCalEvents(calendarId: string) {
  if (!calendarId) return console.log('캘린더 Id 없음');
  const res = await API.get(`/calendar/group/get/${calendarId}`);
  console.log(`캘린더 일정 ;`, res.data);

  const { setGroupEvents } = useGroupEventStore.getState();
  setGroupEvents(res.data);
  return res.data;
}

export async function getAllCalendar() {
  const { setCalendars } = useCalendarListStore.getState();

  const res = await API.get(`/calendar/get_calendar`);
  if (!res) throw new Error('캘린더 전체 받아오기 실패');
  console.log('캘린더 전체 받아오기 :', res); //debug//

  setCalendars(res.data);

  if (Array.isArray(res.data) && res.data) {
    res.data.forEach((data, idx) => {
      sessionStorage.setItem(`${data.title} - ${idx}`, data.calendarId);
    });
  }
  return true;
}

export async function createGroupCalendar({ title, type }: CreateGroupForm) {
  const setType = type;
  const res = await API.post(`/calendar/create`, {
    title: title,
    type: setType,
  });
  if (!res) throw new Error('캘린더 생성 실패');
  console.log(`캘린더 생성`, res);
  return res;
}

export async function createGroupEvent({
  groupCalendarId,
  title,
  author,
  startAt,
  endAt,
  emails,
  color,
}: reqGroupEvent) {
  console.log(`create 일정 api`, title, author, startAt, endAt, emails, color);

  const res = await API.post(`/calendar/group/create/${groupCalendarId}`, {
    title,
    author,
    startAt,
    endAt,
    emails,
    color,
  });
  if (!res) throw new Error('그룹 캘린더 일정 등록 실패');

  return res;
}

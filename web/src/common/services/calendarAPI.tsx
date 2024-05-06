import * as API from '@utils/api';
import { AxiosError } from 'axios';

import { useCalendarListStore, useGroupEventStore, reqGroupEventStore } from '@store/index';
import { Calendar, CreateGroupForm, ErrorResponse } from '@type/index';

export async function getCalEvents(calendarId: string) {
  if (!calendarId)
    return console.log(`CALENDAR - getCalEvents (캘린더 id 없음) : { ${calendarId} }`);

  try {
    const { data: res } = await API.get(`/calendar/group/get/${calendarId}`);
    if (!res) throw new Error('CALENDAR - getCalEvents (db 조회 실패)');
    console.log(`CALENDAR - getCalEvents 성공 :`, res);

    useGroupEventStore.getState().setGroupEvents(res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as ErrorResponse;
      console.error(`CALENDAR - getCalEvents 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function getAllCalendar() {
  if (useCalendarListStore.getState().isLoaded) return;

  try {
    const { data: res } = await API.get(`/calendar/get_calendar`);
    if (!res) throw new Error('CALENDAR - getAllCalendar (db 조회 실패)');

    console.log('CALENDAR - getAllCalendar 성공 :', res); //debug//

    useCalendarListStore.getState().setCalendars(res);

    res.forEach((data: Calendar, idx: number) => {
      sessionStorage.setItem(`${data.title} - ${idx}`, data.calendarId);
    });

    useCalendarListStore.getState().setIsLoaded(true);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as ErrorResponse;
      console.error(`CALENDAR - getAllCalendar 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function createGroupCalendar({ title, type }: CreateGroupForm) {
  try {
    const res = await API.post(`/calendar/create`, {
      title,
      type,
    });
    if (!res) throw new Error('CALENDAR - createGroupCalendar (DB 캘린더 생성 실패)');
    console.log(`CALENDAR - createGroupCalendar 성공 :`, res);

    useCalendarListStore.getState().setIsLoaded(false);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as ErrorResponse;
      console.error(`CALENDAR - createGroupCalendar 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function createGroupEvent({
  groupCalendarId,
  title,
  author,
  startAt,
  endAt,
  emails,
  color,
}: reqGroupEventStore) {
  if (groupCalendarId === 'All') return alert('캘린더 목록에서 캘린더를 선택해주세요.');
  try {
    const { data: res } = await API.post(`/calendar/group/create/${groupCalendarId}`, {
      title,
      author,
      startAt,
      endAt,
      // emails: emails || [],
      // color: color || '#badfff',
    });
    if (!res) throw new Error('CALENDAR - createGroupEvent (DB 이벤트 생성 실패)');
    console.log(`CALENDAR - createGroupEvent 성공 :`, res);
    alert('일정을 등록했습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as ErrorResponse;
      console.error(`CALENDAR - createGroupEvent 실패 :`, data); //debug//
      alert('일정 등록에 실패했습니다.');
    }
  }
}

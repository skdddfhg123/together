import { AxiosError } from 'axios';
import { UUID } from 'crypto';

import * as API from '@utils/api';

import { reqGroupEvent, GroupEvent, Calendar, CreateCalendarForm } from '@type/index';
import {
  useCalendarListStore,
  useGroupEventInfoStore,
  useGroupEventListStore,
  useSelectedCalendarStore,
} from '@store/index';

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
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getAllCalendar 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function createGroupCalendar({ title, type }: CreateCalendarForm) {
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
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - createGroupCalendar 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function removeGroupCalendar(groupCalendar: Calendar | 'All') {
  if (groupCalendar === 'All') return alert('캘린더 목록에서 캘린더를 선택해주세요.');
  try {
    const res = await API.patch(`/calendar/remove/${groupCalendar.calendarId}`);
    console.log(`CALENDAR - removeGroupCalendar 성공 :`, res);

    useCalendarListStore.getState().setIsLoaded(false);
    useSelectedCalendarStore.getState().setSelectedCalendar('All');

    alert('그룹 캘린더가 삭제되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - removeGroupCalendar 실패 :`, data); //debug//
      alert('일정 삭제에 실패했습니다.');
    }
  }
}

export async function getGroupAllEvents(calendarId: UUID) {
  if (!calendarId)
    return console.log(`CALENDAR - getGroupAllEvents (캘린더 id 없음) : { ${calendarId} }`);

  try {
    const { data: res } = await API.get(`/calendar/group/get/v2/${calendarId}`);
    if (!res) throw new Error('CALENDAR - getGroupAllEvents (db 조회 실패)');
    console.log(`CALENDAR - getGroupAllEvents 성공 :`, res);

    useGroupEventListStore.getState().setGroupEvents(res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getGroupAllEvents 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function getGroupOneEvent(groupEventId: UUID) {
  try {
    const { data: res } = await API.get(`/calendar/group/get/detail/${groupEventId}`);
    if (!res) throw new Error('CALENDAR - getGroupOneEvent (db 조회 실패)');
    console.log(`CALENDAR - getGroupOneEvent 성공 :`, res);

    useGroupEventInfoStore.getState().setGroupEventInfo(res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getGroupOneEvent 실패 :`, data); //debug//
      alert('일정을 가져오지 못했습니다.');
    }
  }
}

// TODO 그룹 이벤트 등록시, 본인 email 포함되도록 수정
export async function createGroupEvent({
  groupCalendarId,
  title,
  startAt,
  endAt,
  members,
  color,
}: reqGroupEvent) {
  if (groupCalendarId === 'All') return alert('캘린더 목록에서 캘린더를 선택해주세요.');

  try {
    const { data: res } = await API.post(`/calendar/group/create/${groupCalendarId}`, {
      title,
      startAt,
      endAt,
      member: members || [],
      color: color || '#badfff',
    });
    if (!res) throw new Error('CALENDAR - createGroupEvent (DB 이벤트 생성 실패)');
    console.log(`CALENDAR - createGroupEvent 성공 :`, res);
    alert('일정을 등록했습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - createGroupEvent 실패 :`, data); //debug//
      alert('일정 등록에 실패했습니다.');
    }
  }
}

export async function updateGroupEvent({
  title,
  startAt,
  endAt,
  members,
  color,
  pinned,
  groupEventId,
  alerts,
}: GroupEvent) {
  try {
    const { data: res } = await API.patch(`/calendar/group/update/${groupEventId}`, {
      title,
      startAt,
      endAt,
      members,
      color,
      pinned,
      alerts,
    });
    if (!res) throw new Error(`CALENDAR - updateGroupEvent (DB 수정 반영 실패)`);
    console.log(`CALENDAR - updateGroupEvent 성공 :`, res);
    alert('일정이 수정되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - updateGroupEvent 실패 :`, data); //debug//
      alert('일정 수정에 실패했습니다.');
    }
  }
}

export async function removeGroupEvent(groupEventId: UUID | null) {
  if (!groupEventId) return alert('삭제할 일정을 선택해주세요.');

  try {
    const res = await API.patch(`/calendar/group/remove/${groupEventId}`);
    console.log(`CALENDAR - removeGroupEvent 성공 :`, res);

    alert('일정이 삭제되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - removeGroupEvent 실패 :`, data); //debug//
      alert('일정 삭제에 실패했습니다.');
    }
  }
}

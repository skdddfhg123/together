import { AxiosError } from 'axios';
import { UUID } from 'crypto';

import useToast from '@hooks/useToast';
import * as API from '@utils/api';
import { reqEmoji } from '@type/index';

export async function fetchEmojiList(calendarId: UUID) {
  try {
    const { data: res } = await API.get(`/emoji/get/${calendarId}`);
    if (!res) throw new Error('CHAT - fetchEmoji 실패');
    console.log(`CHAT - fetchEmojiList 성공`, res); //debug//

    return res;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response;
      console.log(`CHAT - fetchEmojiList 실패:`, data); //debug//
    }
  }
}

// ************************************ 이모지
export async function uploadGroupEmoji({ calendarId, emojiFormData }: reqEmoji) {
  try {
    const res = await API.post(`/emoji/create/${calendarId}`, emojiFormData);
    if (!res) throw new Error('CHAT - uploadGroupEmoji 실패 : (DB 댓글 등록 실패)');
    console.log(`CHAT - uploadGroupEmoji 성공 :`, res); //debug//
    useToast('success', '이모지가 등록되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CHAT - uploadGroupEmoji 실패 :`, data); //debug//
      useToast('warning', '이모지 등록에 실패했습니다.');
    }
  }
}

export async function deleteGroupEmoji(emojiId: UUID) {
  try {
    const res = await API.patch(`/emoji/remove/${emojiId}`);
    if (!res) throw new Error('CHAT - deleteGroupEmoji 실패 : (DB 삭제 실패)');
    console.log(`CHAT - deleteGroupEmoji 성공 :`, res); //debug//
    useToast('error', '이모지가 삭제되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CHAT - deleteGroupEmoji 실패 :`, data); //debug//
      useToast('warning', '이모지 삭제 실패했습니다.');
    }
  }
}

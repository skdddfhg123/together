import { AxiosError } from 'axios';
import * as API from '@utils/api';
import useToast from '@hooks/useToast';
import { getCookie } from '@utils/cookie';

export async function getEvents() {
  try {
    const googleAccess = getCookie('googleAccessToken');
    const res = await API.post(`/google/calendar`, { googleAccessToken: googleAccess });
    if (!res) throw new Error('GOOGLE - getGoogleEvent 실패 : ( DB 에러 )');

    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error(`GOOGLE - getGoogleEvent 실패 :`, err); //debug//
    useToast('default', '구글 캘린더 받아오기에 실패했습니다..');
    // if (err.response?.status === 401) console.log(`카카오톡 `, err);
  }
}

import { AxiosError } from 'axios';

import * as API from '@utils/api';

export async function getImages() {
  try {
    const res = await API.get('/images');
    console.log(`채팅 이모지 로딩 res`, res); //debug//

    return res;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response;
      console.log(`CHAT - getEmoji 실패:`, data); //debug//
    }
  }
}

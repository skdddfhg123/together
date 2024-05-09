import axios, { AxiosError } from 'axios';

import * as API from '@utils/api';

export async function getImages() {
  try {
    const res = await API.get('/images');
    console.log(`res`, res);

    return res;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response;
      console.log(`CHAT - getEmoji 실패:`, data); //debug//
      // console.error(`Chat - getEmoji 실패:`, data); //debug//
    }
  }
}
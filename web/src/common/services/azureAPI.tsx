import React from 'react';
import { AxiosError } from 'axios';
import * as API from '@utils/api';
import useToast from '@hooks/useToast';

export async function getEvents() {
  try {
    // const microAccess = getCookie('microsoftAccessToken');
    const microAccess = sessionStorage.getItem('microsoftAccessToken');
    const res = await API.post(`/azure/calendar`, { azureAccessToken: microAccess });
    if (!res) throw new Error('Azure - Outlook 실패 : ( DB 에러 )');

    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Outlook 일정 가져오기 실패`, err); //debug//
    useToast('default', 'Outlook 캘린더 받아오기에 실패했습니다..');
  }
}

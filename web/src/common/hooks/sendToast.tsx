import React from 'react';
import { toast } from 'react-toastify';

type method = 'error' | 'warning' | 'success' | 'default';

export default function sendToast(method: method, message: string) {
  const toastMessage = <div style={{ fontFamily: 'Jua' }}>{message}</div>;

  if (method === 'error') {
    return toast.error(toastMessage, {
      containerId: 'calendarAlert',
    });
  } else if (method === 'warning') {
    return toast.warning(toastMessage, {
      containerId: 'calendarAlert',
    });
  } else if (method === 'success') {
    return toast.success(toastMessage, {
      containerId: 'calendarAlert',
    });
  } else if (method === 'default') {
    return toast(toastMessage, {
      containerId: 'calendarAlert',
      style: { color: '#0120c9', border: '3px solid #0120c9' },
    });
  } else {
    return null;
  }
}

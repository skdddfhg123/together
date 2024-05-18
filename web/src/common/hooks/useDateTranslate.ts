import { addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function convertUtcToKst(date: Date) {
  return toZonedTime(date, 'Asia/Seoul');
}

export function getDatesInRange(startDate: Date, endDate: Date) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dates;
}

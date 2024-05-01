export function transToKorDate(isoString: string, hoursToAdd: number): string {
  const date = new Date(isoString);
  date.setUTCHours(date.getUTCHours() + hoursToAdd);
  return date.toISOString();
}

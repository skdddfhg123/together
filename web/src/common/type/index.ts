export type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
}

export interface KakaoEvent {
  title?: string;
  startAt: string;
  endAt: string;
  isPast: boolean;
  userCalendarId: string;
  social: string;
  socialEventId: string;
}

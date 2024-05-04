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

export interface SignInForm {
  useremail: string;
  password: string;
}

export interface SignUpForm extends SignInForm {
  nickname: string;
}

export interface ErrorResponse {
  message: string;
}

export interface SocialEvent {
  title?: string;
  startAt: string;
  endAt: string;
  isPast: boolean;
  userCalendarId: string;
  social: string;
  socialEventId: string;
}

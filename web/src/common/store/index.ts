import create from 'zustand';
// import { KakaoEvent } from '@type/index';

interface CalendarState {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
}

export const useSetDayStore = create<CalendarState>((set) => ({
  selectedDay: null,
  setSelectedDay: (day: Date | null) => set({ selectedDay: day }),
}));

interface SocialEvent {
  title?: string;
  startAt: string;
  endAt: string;
  isPast: boolean;
  userCalendarId?: string;
  social: string;
  socialEventId: string;
}

interface SocialEventState {
  socialEvents: SocialEvent[];
  setSocialEvents: (events: SocialEvent[]) => void;
}

export const useSocialEventStore = create<SocialEventState>((set) => ({
  socialEvents: [],
  setSocialEvents: (events) => set({ socialEvents: events }),
}));

interface UserInfo {
  nickname: string;
  useremail: string;
  userCanlendarId: string;
}

interface User {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
}

export const useUserInfoStore = create<User>((set) => ({
  userInfo: null,
  setUserInfo: (user: UserInfo | null) => set({ userInfo: user }),
}));

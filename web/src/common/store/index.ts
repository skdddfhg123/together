import { create } from 'zustand';
import { Calendar } from '@type/index';

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

interface User {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
}

interface UserInfo {
  nickname?: string;
  useremail?: string;
  userCalendarId?: string;
  kakaoId?: number;
  kakaoRefresh?: number;
}

export const useUserInfoStore = create<User>((set) => ({
  userInfo: null,
  setUserInfo: (user: UserInfo | null) => set({ userInfo: user }),
}));

interface CalendarStore {
  calendars: Calendar[];
  setCalendars: (calendars: Calendar[]) => void;
}

export const useCalendarListStore = create<CalendarStore>((set) => ({
  calendars: [],
  setCalendars: (calendars) => set({ calendars }),
}));

interface NowCalendarStore {
  nowCalendar: string | null;
  setNowCalendar: (calendarId: string | null) => void;
}

export const useNowCalendarStore = create<NowCalendarStore>((set) => ({
  nowCalendar: null,
  setNowCalendar: (calendarId: string | null) => set({ nowCalendar: calendarId }),
}));

export interface reqGroupEvent {
  groupCalendarId?: string;
  title: string;
  author: string;
  color: string;
  startAt: string;
  endAt: string;
  emails?: string[] | null;
}

interface resGroupEvent extends reqGroupEvent {
  groupEventId: string;
  member: string[];
  alerts?: number | null;
  pinned: boolean;
  isDeleted: boolean;
  deletedAt: null | string;
}

interface GroupEventsState {
  groupEvents: resGroupEvent[];
  setGroupEvents: (events: resGroupEvent[]) => void;
}

export const useGroupEventStore = create<GroupEventsState>((set) => ({
  groupEvents: [],
  setGroupEvents: (events: resGroupEvent[]) => set({ groupEvents: events }),
}));

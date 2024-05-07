import { create } from 'zustand';
import { Calendar, SocialEvent } from '@type/index';

interface SelectedDayState {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
}

export const useSelectedDayStore = create<SelectedDayState>((set) => ({
  selectedDay: null,
  setSelectedDay: (day: Date | null) => set({ selectedDay: day }),
}));

interface SocialEventState {
  socialEvents: SocialEvent[];
  setSocialEvents: (events: SocialEvent[]) => void;
}

export const useSocialEventStore = create<SocialEventState>((set) => ({
  socialEvents: [],
  setSocialEvents: (events) => set({ socialEvents: events }),
}));

interface UserStore {
  userInfo: UserInfoStore | null;
  setUserInfo: (user: UserInfoStore | null) => void;
}

interface UserInfoStore {
  nickname: string;
  useremail: string;
  birthDay?: string | null;
  phone?: string | null;
  registeredAt?: string;
  thumbnail?: string | null;
  updatedAt?: string;
  userCalendarId?: UserCalendarInfo;
  kakaoId?: number;
  kakaoRefresh?: number;
}

interface UserCalendarInfo {
  userCalendarId: string;
  groupCalendar?: resGroupEventStore[];
  socialEvents?: SocialEvent[];
}

export const useUserInfoStore = create<UserStore>((set) => ({
  userInfo: null,
  setUserInfo: (user: UserInfoStore | null) => set({ userInfo: user }),
}));

interface CalendarStore {
  calendars: Calendar[];
  isLoaded: boolean;
  setCalendars: (calendars: Calendar[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useCalendarListStore = create<CalendarStore>((set) => ({
  calendars: [],
  isLoaded: false,
  setCalendars: (calendars) => set({ calendars }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),
}));

interface NowCalendarStore {
  nowCalendar: string;
  setNowCalendar: (calendarId: string) => void;
}

export const useNowCalendarStore = create<NowCalendarStore>((set) => ({
  nowCalendar: 'All',
  setNowCalendar: (calendarId: string) => set({ nowCalendar: calendarId }),
}));

export interface reqGroupEventStore {
  groupCalendarId?: string;
  emails?: string[] | null;
  color?: string | null;
  title: string;
  author: string;
  startAt: string;
  endAt: string;
}

export interface resGroupEventStore extends reqGroupEventStore {
  alerts?: number | null;
  attachment?: string | null;
  groupEventId: string;
  member: string[];
  pinned: boolean;
}

interface GroupEventsState {
  groupEvents: resGroupEventStore[];
  setGroupEvents: (events: resGroupEventStore[]) => void;
}

export const useGroupEventStore = create<GroupEventsState>((set) => ({
  groupEvents: [],
  setGroupEvents: (events: resGroupEventStore[]) => set({ groupEvents: events }),
}));

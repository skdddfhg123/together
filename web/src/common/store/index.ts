import { create } from 'zustand';
import { UUID } from 'crypto';

import { GroupEvent, UserInfo, Calendar, CalendarId, SocialEvent, EventFeed } from '@type/index';

interface SelectedDayState {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
}

export const useSelectedDayStore = create<SelectedDayState>((set) => ({
  selectedDay: null,
  setSelectedDay: (day: Date | null) => set({ selectedDay: day }),
}));

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (user: UserInfo | null) => set({ userInfo: user }),
}));

interface CalendarListState {
  calendars: Calendar[];
  isLoaded: boolean;
  setCalendars: (calendars: Calendar[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useCalendarListStore = create<CalendarListState>((set) => ({
  calendars: [],
  isLoaded: false,
  setCalendars: (calendars) => set({ calendars }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),
}));

interface SelectedCalendarState {
  selectedCalendar: Calendar | 'All';
  setSelectedCalendar: (calendar: Calendar | 'All') => void;
}

export const useSelectedCalendarStore = create<SelectedCalendarState>((set) => ({
  selectedCalendar: 'All',
  setSelectedCalendar: (calendar: Calendar | 'All') => set({ selectedCalendar: calendar }),
}));

interface GroupEventListState {
  groupEventList: GroupEvent[];
  setGroupEvents: (events: GroupEvent[]) => void;
}

export const useGroupEventListStore = create<GroupEventListState>((set) => ({
  groupEventList: [],
  setGroupEvents: (events: GroupEvent[]) => set({ groupEventList: events }),
}));

interface GroupEventInfoState {
  groupEventInfo: GroupEvent | null;
  isLoaded: boolean;
  setGroupEventInfo: (event: GroupEvent) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useGroupEventInfoStore = create<GroupEventInfoState>((set) => ({
  groupEventInfo: null,
  isLoaded: false,
  setGroupEventInfo: (event: GroupEvent) => set({ groupEventInfo: event }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),
}));

interface SocialEventListState {
  socialEvents: SocialEvent[];
  setSocialEvents: (events: SocialEvent[]) => void;
}

export const useSocialEventListStore = create<SocialEventListState>((set) => ({
  socialEvents: [],
  setSocialEvents: (events) => set({ socialEvents: events }),
}));

interface EventFeedListState {
  eventFeedList: EventFeed[];
  setEventFeedList: (eventFeeds: EventFeed[]) => void;
}

export const useEventFeedListStore = create<EventFeedListState>((set) => ({
  eventFeedList: [],
  setEventFeedList: (eventFeeds) => set({ eventFeedList: eventFeeds }),
}));

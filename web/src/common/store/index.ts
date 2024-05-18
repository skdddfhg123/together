import { create } from 'zustand';

import { GroupEvent, UserInfo, Calendar, EventFeed, AllEvent, MemberWithEvent } from '@type/index';

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
  reset: () => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (user: UserInfo | null) => set({ userInfo: user }),
  reset: () => set({ userInfo: null }),
}));

interface CalendarListState {
  calendarList: Calendar[];
  isLoaded: boolean;
  setCalendarList: (calendarList: Calendar[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  reset: () => void;
}

export const useCalendarListStore = create<CalendarListState>((set) => ({
  calendarList: [],
  isLoaded: false,
  setCalendarList: (calendarList) => set({ calendarList }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),
  reset: () => set({ calendarList: [], isLoaded: false }),
}));

interface SelectedCalendarState {
  selectedCalendar: Calendar | 'All';
  setSelectedCalendar: (calendar: Calendar | 'All') => void;
  reset: () => void;
}

export const useSelectedCalendarStore = create<SelectedCalendarState>((set) => ({
  selectedCalendar: 'All',
  setSelectedCalendar: (calendar: Calendar | 'All') => set({ selectedCalendar: calendar }),
  reset: () => set({ selectedCalendar: 'All' }),
}));

interface SelectedDayState {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
  reset: () => void;
}

export const useSelectedDayStore = create<SelectedDayState>((set) => ({
  selectedDay: null,
  setSelectedDay: (day: Date | null) => set({ selectedDay: day }),
  reset: () => set({ selectedDay: null }),
}));

interface GroupEventListState {
  groupEventList: GroupEvent[];
  setGroupEvents: (events: GroupEvent[]) => void;
  reset: () => void;
}

export const useGroupEventListStore = create<GroupEventListState>((set) => ({
  groupEventList: [],
  setGroupEvents: (events: GroupEvent[]) => set({ groupEventList: events }),
  reset: () => set({ groupEventList: [] }),
}));

interface SocialEventListState {
  socialEventList: AllEvent[];
  setSocialEventList: (events: AllEvent[]) => void;
  reset: () => void;
}

export const useSocialEventListStore = create<SocialEventListState>((set) => ({
  socialEventList: [],
  setSocialEventList: (events) => set({ socialEventList: events }),
  reset: () => set({ socialEventList: [] }),
}));

interface AllEventListState {
  AllEventList: AllEvent[];
  setAllEventList: (events: AllEvent[]) => void;
  reset: () => void;
}

export const useAllEventListStore = create<AllEventListState>((set) => ({
  AllEventList: [],
  setAllEventList: (events) => set({ AllEventList: events }),
  reset: () => set({ AllEventList: [] }),
}));

interface MemberEventListState {
  MemberEventList: MemberWithEvent[];
  setAllEventList: (memberAndEvent: MemberWithEvent[]) => void;
}

export const useMemberEventListByDateState = create<MemberEventListState>((set) => ({
  MemberEventList: [],
  setAllEventList: (memberAndEvent) => set({ MemberEventList: memberAndEvent }),
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

interface EventFeedListState {
  eventFeedList: EventFeed[];
  setEventFeedList: (eventFeeds: EventFeed[]) => void;
  reset: () => void;
}

export const useEventFeedListStore = create<EventFeedListState>((set) => ({
  eventFeedList: [],
  setEventFeedList: (eventFeeds) => set({ eventFeedList: eventFeeds }),
  reset: () => set({ eventFeedList: [] }),
}));

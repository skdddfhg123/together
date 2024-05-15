import { create } from 'zustand';

import { GroupEvent, UserInfo, Calendar, EventFeed, AllEvent, MemberWithEvent } from '@type/index';

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (user: UserInfo | null) => set({ userInfo: user }),
}));

interface CalendarListState {
  calendarList: Calendar[];
  isLoaded: boolean;
  setCalendarList: (calendarList: Calendar[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useCalendarListStore = create<CalendarListState>((set) => ({
  calendarList: [],
  isLoaded: false,
  setCalendarList: (calendarList) => set({ calendarList }),
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

interface SelectedDayState {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
}

export const useSelectedDayStore = create<SelectedDayState>((set) => ({
  selectedDay: null,
  setSelectedDay: (day: Date | null) => set({ selectedDay: day }),
}));

interface GroupEventListState {
  groupEventList: GroupEvent[];
  setGroupEvents: (events: GroupEvent[]) => void;
}

export const useGroupEventListStore = create<GroupEventListState>((set) => ({
  groupEventList: [],
  setGroupEvents: (events: GroupEvent[]) => set({ groupEventList: events }),
}));

interface SocialEventListState {
  socialEventList: AllEvent[];
  setSocialEventList: (events: AllEvent[]) => void;
}

export const useSocialEventListStore = create<SocialEventListState>((set) => ({
  socialEventList: [],
  setSocialEventList: (events) => set({ socialEventList: events }),
}));

interface AllEventListState {
  AllEventList: AllEvent[];
  setAllEventList: (events: AllEvent[]) => void;
}

export const useAllEventListStore = create<AllEventListState>((set) => ({
  AllEventList: [],
  setAllEventList: (events) => set({ AllEventList: events }),
}));

interface MemberEventListState {
  MemberEventList: MemberWithEvent[];
  setAllEventList: (memberAndEvent: MemberWithEvent[]) => void;
}

export const useMemberEventListState = create<MemberEventListState>((set) => ({
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
}

export const useEventFeedListStore = create<EventFeedListState>((set) => ({
  eventFeedList: [],
  setEventFeedList: (eventFeeds) => set({ eventFeedList: eventFeeds }),
}));

// ================================ 동민
export const useMemberEventListByDateState = create<MemberEventListState>((set) => ({
  MemberEventList: [],
  setAllEventList: (newList) => set({ MemberEventList: newList }),
}));
import create from 'zustand';
import { KakaoEvent } from '@type/index';

interface CalendarState {
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
}

export const useSetDay = create<CalendarState>((set) => ({
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

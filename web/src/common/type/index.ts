import { UUID } from 'crypto';

// ************************** 회원가입 / 로그인
export type Image = string;

export interface SignInForm {
  useremail: string;
  password: string;
}

export interface SignUpForm extends SignInForm {
  nickname: string;
}

export type UserInfo = {
  nickname: string;
  useremail: string;
  birthDay: Date | null;
  phone: string | null;
  thumbnail: Image | null;
  isFirst: boolean;
  // userCalendarId: UserCalendarListInfo;
  // kakaoId?: number;    //TODO setting 객체로 받을 듯?
  // kakaoRefresh?: number;
};

// ************************** 캘린더

export interface ImageFile {
  name?: string | UUID;
  file?: File;
  imageSrc?: Image; // DB에서 전달받는 src
  src: Image;
}

export type CalendarId = UUID | 'All';

export type CreateCalendarForm = {
  title: string;
  type: string; //TODO color로 변경?
};

export type Calendar = {
  calendarId: UUID;
  title: string;
  coverImage: ImageFile | null;
  bannerImage?: ImageFile;
  type: string; // Color
  attendees: Member[]; // 객체
  createdAt: Date;
};

// ************************** 이벤트 (일정)

export interface Author {
  useremail: string;
  thumbnail: Image | null;
  nickname: string;
}

export type Member = Author;

export interface MemberWithEvent extends Author {
  allevents?: DefaultEvent[];
  groupedEvent: GroupingMemberEvent;
}

export interface DefaultEvent {
  //* 그룹 멤버들 일정 + create 할 때
  groupCalendarId?: UUID;
  title: string | null;
  startAt: Date;
  endAt: Date;
}

export interface reqEvent extends DefaultEvent {
  color: string;
  member: string[] | null;
}

export interface GroupingMemberEvent {
  [key: string]: DefaultEvent[];
}

export interface AllEvent extends DefaultEvent {
  id?: UUID;
  type?: string; // 그룹 캘린더에 지정된 색
  group?: string;
  social: 'kakao' | 'google' | 'outlook'; //TODO 'kakao' | 'google' | 'outlook'
}

export interface GroupEvent extends DefaultEvent {
  groupEventId: UUID;
  member: string[];
  color: string;
  pinned: boolean;
  alerts: Date | null;
  groupCalendarTitle?: string;
  author?: string;
  createdAt?: Date;
  reqMember?: Member[];
}

export interface GoogleEvent {
  startAt: Date;
  endAt: Date;
  title: string;
  social: 'google';
  socialEventId: UUID;
}

// ************************** 피드

export interface reqEventFeed {
  groupEventId?: UUID | null;
  feedType: number | string;
  title: 'Title';
  content: string;
  images: ImageFile[];
}

export interface EventFeed extends reqEventFeed {
  thumbnail?: Image | null;
  feedId: UUID;
  nickname: string;
  createdAt: Date;
}

// ************************** 댓글

export interface reqComment {
  feedId?: UUID;
  content: string;
}

export interface Comment extends reqComment {
  nickname: string;
  thumbnail: Image;
  feedCommentId: UUID;
  createdAt: Date;
}

// ************************** 채팅

export type Message = {
  id: UUID; // 소켓 ID -> 나갔다 들어왔다 할 때 마다 바뀜
  nickname: string;
  message: string;
  image?: Image;
  registeredAt: string;
};

export type ChatList = {
  [date: string]: Message[];
};

export type reqEmoji = {
  calendarId?: UUID;
  emojiFormData: FormData;
};

export type Emoji = {
  emojiId: UUID;
  emojiUrl: Image;
  emojiName: string;
  createdAt: Date;
};

/* 
? 데이트 스트링 버전
import { UUID } from 'crypto';

// ************************** 회원가입 / 로그인
export type Image = string;

export interface SignInForm {
  useremail: string;
  password: string;
}

export interface SignUpForm extends SignInForm {
  nickname: string;
}

export type UserInfo = {
  nickname: string;
  useremail: string;
  birthDay: string | null;
  phone: string | null;
  thumbnail: Image | null;
  isFirst: boolean;
  // userCalendarId: UserCalendarListInfo;
  // kakaoId?: number;    //TODO setting 객체로 받을 듯?
  // kakaoRefresh?: number;
};

// ************************** 캘린더

export interface ImageFile {
  name?: string | UUID;
  file?: File;
  imageSrc?: Image; // DB에서 전달받는 src
  src: Image;
}

export type CalendarId = UUID | 'All';

export type CreateCalendarForm = {
  title: string;
  type: string; //TODO color로 변경?
};

export type Calendar = {
  calendarId: UUID;
  title: string;
  coverImage: ImageFile | null;
  bannerImage?: ImageFile;
  type: string; // Color
  attendees: Member[]; // 객체
  createdAt: string;
};

// ************************** 이벤트 (일정)

export interface Author {
  useremail: string;
  thumbnail: Image | null;
  nickname: string;
}

export type Member = Author;

export interface MemberWithEvent extends Author {
  allevents?: DefaultEvent[];
  groupedEvent: GroupingMemberEvent;
}

export interface DefaultEvent {
  //* 그룹 멤버들 일정 + create 할 때
  groupCalendarId?: UUID;
  title: string | null;
  startAt: string;
  endAt: string;
}

export interface reqEvent extends DefaultEvent {
  color: string;
  member: string[] | null;
}

export interface GroupingMemberEvent {
  [key: string]: DefaultEvent[];
}

export interface AllEvent extends DefaultEvent {
  id?: UUID;
  type?: string; // 그룹 캘린더에 지정된 색
  group?: string;
  social: 'kakao' | 'google'; //TODO 'kakao' | 'google' | 'outlook'
}

export interface GroupEvent extends DefaultEvent {
  groupEventId: UUID;
  member: string[];
  color: string;
  pinned: boolean;
  alerts: number | null;
  groupCalendarTitle?: string;
  author?: string;
  createdAt?: string;
  reqMember?: Member[];
}

export interface GoogleEvent {
  startAt: string;
  endAt: string;
  title: string;
  social: 'google';
  socialEventId: UUID;
}

// ************************** 피드

export interface reqEventFeed {
  groupEventId?: UUID | null;
  feedType: number | string;
  title: 'Title';
  content: string;
  images: ImageFile[];
}

export interface EventFeed extends reqEventFeed {
  thumbnail?: Image | null;
  feedId: UUID;
  nickname: string;
  createdAt: string;
}

// ************************** 댓글

export interface reqComment {
  feedId?: UUID;
  content: string;
}

export interface Comment extends reqComment {
  nickname: string;
  thumbnail: Image;
  feedCommentId: UUID;
  createdAt: string;
}

// ************************** 채팅

export type Message = {
  id: UUID; // 소켓 ID -> 나갔다 들어왔다 할 때 마다 바뀜
  nickname: string;
  message: string;
  image?: Image;
  registeredAt: string;
};

export type ChatList = {
  [date: string]: Message[];
};

export type reqEmoji = {
  calendarId?: UUID;
  emojiFormData: FormData;
};

export type Emoji = {
  emojiId: UUID;
  emojiUrl: Image;
  emojiName: string;
  createdAt: string;
};

*/

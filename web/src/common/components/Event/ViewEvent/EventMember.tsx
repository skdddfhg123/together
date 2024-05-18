import React from 'react';
import { Calendar, GroupEvent, Member } from '@type/index';

import default_user from '@assets/default_user.png';

interface EventMemberProps {
  eventInfo: GroupEvent | null;
  calendarMember: Member[];
  selectedCalendar: Calendar | 'All';
}

export default function EventMember({
  eventInfo,
  calendarMember,
  selectedCalendar,
}: EventMemberProps) {
  if (
    !eventInfo ||
    !eventInfo.member ||
    eventInfo.member.length === 0 ||
    selectedCalendar === 'All' ||
    calendarMember.length === 0
  ) {
    return null;
  }

  return (
    <>
      <p className="my-2 mx-auto w-32 border-gray-500 border-b-2 text-center">함께하는 멤버</p>
      <div className="FLEX-verC w-full space-x-3 items-center">
        {eventInfo.member.map((email: unknown) => {
          const useremail = email as string;
          const foundMember = calendarMember.find((m) => m.useremail === useremail);
          return (
            <span key={useremail} className="FLEX-horizC min-w-16 font-semibold">
              {foundMember && foundMember.thumbnail ? (
                <img
                  className="max-h-14 max-w-14 object-contain rounded-full"
                  src={foundMember.thumbnail}
                  alt={foundMember.nickname}
                />
              ) : (
                <img
                  className="max-h-14 max-w-14 object-contain rounded-full"
                  src={default_user}
                  alt="default Img"
                />
              )}
              <div>{foundMember ? foundMember.nickname : '알 수 없는 멤버'}</div>
            </span>
          );
        })}
      </div>
    </>
  );
}

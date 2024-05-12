import React from 'react';
import { Tooltip } from 'react-tooltip';
import { format } from 'date-fns';

import { Calendar } from '@type/index';
import { useMemberEventListState, useUserInfoStore } from '@store/index';

import default_user from '@assets/default_user.png';

interface GroupMemberProps {
  selectedCalendar: Calendar | 'All';
  localDayKey: string;
  // buildCalendarDays: () => Date[];
}

export default React.memo(function GroupMemberEvent({
  selectedCalendar,
  localDayKey,
}: GroupMemberProps) {
  const { MemberEventList } = useMemberEventListState();
  const { userInfo } = useUserInfoStore();

  return (
    <>
      {MemberEventList.flatMap((member) => {
        if (
          !member.groupedEvent ||
          !member.groupedEvent[localDayKey] ||
          member.useremail === userInfo?.useremail
        )
          return [];

        const eventsDetail = member.groupedEvent[localDayKey].map((event, idx) => (
          <div key={event.title + idx} className="FLEX-horizC">
            <div className="text-xl">{event.title}</div>
            <div className="FLEX-verC">
              <div className="FLEX-horizC">
                <span>{format(new Date(event.startAt), 'yyyy년')}</span>
                <span>{format(new Date(event.startAt), 'MM월 dd일 HH:mm')}</span>
              </div>
              <div className="FLEX-horizC">
                <span>{format(new Date(event.endAt), 'yyyy년')}</span>
                <span>{format(new Date(event.endAt), 'MM월 dd일 HH:mm')}</span>
              </div>
            </div>
          </div>
        ));

        if (selectedCalendar === 'All') return;

        const matchingAttendee = selectedCalendar.attendees.find(
          (attendee) => attendee.useremail === member.useremail,
        );

        const tooltipId = `${member.nickname}-${localDayKey}-tooltip`;

        return (
          <span
            key={tooltipId}
            data-tooltip-id={tooltipId}
            data-tooltip-place="bottom"
            data-tooltip-variant="dark"
            // data-tooltip-variant="light"
            // data-tooltip-variant="info"
          >
            <img
              className="w-10"
              src={matchingAttendee?.thumbnail ? matchingAttendee.thumbnail : default_user}
              alt={matchingAttendee?.nickname}
            />
            <Tooltip id={tooltipId} data-tooltip-class-name="tooltip-box">
              <div className="FLEX-horizC">
                {matchingAttendee && (
                  <>
                    <img
                      className="w-24 mx-auto"
                      src={matchingAttendee.thumbnail ? matchingAttendee.thumbnail : default_user}
                      alt="thumbnail"
                    />
                    <span className="text-xl">{matchingAttendee.nickname}</span>
                  </>
                )}
                <div>{eventsDetail}</div>
              </div>
            </Tooltip>
          </span>
        );
      })}
    </>
  );
});

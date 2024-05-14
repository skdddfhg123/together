import React from 'react';
import { Tooltip } from 'react-tooltip';
import { format } from 'date-fns';

import { Calendar, MemberWithEvent } from '@type/index';

import default_user from '@assets/default_user.png';

interface GroupMemberProps {
  selectedCalendar: Calendar | 'All';
  MemberEventList: MemberWithEvent[];
  localDayKey: string;
}

export default React.memo(function GroupMemberEvent({
  MemberEventList,
  localDayKey,
}: GroupMemberProps) {
  return (
    <>
      {MemberEventList.flatMap((member) => {
        if (!member.groupedEvent || !member.groupedEvent[localDayKey]) return [];

        const eventsDetail = member.groupedEvent[localDayKey].map((event, idx) => (
          <div key={event.title + idx} className="flex w-full">
            <div className="FLEX-ver w-full space-x-1">
              <span className="min-w-36 text-xl">{event.title}</span>
              <span className="text-lg">
                {`${format(new Date(event.startAt), 'HH:mm')} ~
               ${format(new Date(event.endAt), 'HH:mm')}`}
              </span>
              {/* <div className="FLEX-horizC">
                <span>{format(new Date(event.startAt), 'yyyy년')}</span>
                <span>{format(new Date(event.startAt), 'MM월 dd일 HH:mm')}</span>
              </div>
              <div className="FLEX-horizC">
                <span>{format(new Date(event.endAt), 'yyyy년')}</span>
                <span>{format(new Date(event.endAt), 'MM월 dd일 HH:mm')}</span>
              </div> */}
            </div>
          </div>
        ));

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
              className="w-6 rounded-full"
              src={member?.thumbnail ? member.thumbnail : default_user}
              alt={member?.nickname}
            />
            <Tooltip id={tooltipId} data-tooltip-class-name="tooltip-box">
              <div className="FLEX-horizC w-80">
                {member && (
                  <>
                    <img
                      className="w-24 mx-auto rounded-full mt-4"
                      src={member.thumbnail ? member.thumbnail : default_user}
                      alt="thumbnail"
                    />
                    <span className="text-xl mb-4">{member.nickname}</span>
                  </>
                )}
              </div>
              <div className="border rounded">{eventsDetail}</div>
            </Tooltip>
          </span>
        );
      })}
    </>
  );
});

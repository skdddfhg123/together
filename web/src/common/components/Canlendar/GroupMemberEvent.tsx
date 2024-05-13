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
  selectedCalendar,
  MemberEventList,
  localDayKey,
}: GroupMemberProps) {
  return (
    <>
      {MemberEventList.flatMap((member) => {
        if (!member.groupedEvent || !member.groupedEvent[localDayKey]) return [];

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
              className="w-8"
              src={member?.thumbnail ? member.thumbnail : default_user}
              alt={member?.nickname}
            />
            <Tooltip id={tooltipId} data-tooltip-class-name="tooltip-box">
              <div className="FLEX-horizC">
                {member && (
                  <>
                    <img
                      className="w-24 mx-auto"
                      src={member.thumbnail ? member.thumbnail : default_user}
                      alt="thumbnail"
                    />
                    <span className="text-xl">{member.nickname}</span>
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

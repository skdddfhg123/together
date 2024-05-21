import React from 'react';

import InviteLinkGenerator from '@components/Menu/InviteLinkGenerator';
import { Calendar } from '@type/index';

import default_user from '@assets/default_user.png';

interface memberTapProps {
  selectedCalendar: Calendar | 'All';
  onClose: () => void;
}

export default function memberTap({ selectedCalendar, onClose }: memberTapProps) {
  return (
    <div className="h-full">
      <header className="FLEX-verA rMenu-header">
        <h2>Member</h2>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mr-2 text-3xl text-black hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
      </header>
      <main className="FLEX-horizC h-full p-4 ">
        {selectedCalendar !== 'All' && selectedCalendar.attendees && (
          <div className="FLEX-horiz justify-center w-full h-full space-y-2 border rounded">
            {selectedCalendar.attendees.map((attendee, index) => (
              <div key={index} className="FLEX-ver items-center m-2 space-x-4">
                <img
                  className="w-20 h-20 object-cover rounded-full 
                  ANIMATION hover:object-contain hover:w-40 hover:h-40 hover:rounded-full"
                  src={attendee.thumbnail || default_user}
                  alt={attendee.nickname}
                />
                <span className="text-xl font-bold">{attendee.nickname}</span>
              </div>
            ))}
          </div>
        )}
        <InviteLinkGenerator />
      </main>
    </div>
  );
}

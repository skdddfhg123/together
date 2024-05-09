import React from 'react';
import InviteLinkGenerator from '@components/User/InviteLinkGenerator';

interface memberTapProps {
  onClose: () => void;
}

export default function memberTap({ onClose }: memberTapProps) {
  return (
    <>
      <header className="FLEX-verA rMenu-header">
        <h2>Member</h2>
        <button className="BTN" onClick={onClose}>
          Close
        </button>
      </header>
      <main className="FLEX-horizC text-xl mx-auto">
        <InviteLinkGenerator />
      </main>
    </>
  );
}

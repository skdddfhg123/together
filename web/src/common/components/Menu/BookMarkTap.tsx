import React, { useState } from 'react';

interface BookmarpProps {
  onClose: () => void;
}

export default function BookMarkTap({ onClose }: BookmarpProps) {
  return (
    <div className={`flex flex-row justify-between`}>
      <div>bookmark</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

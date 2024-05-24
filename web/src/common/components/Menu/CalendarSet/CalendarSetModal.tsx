import React from 'react';
import Modal from 'react-modal';

import { Calendar } from '@type/index';

import '@styles/modalStyle.css';

interface CalendarSetModalProps {
  selectedCalendar: Calendar | 'All';
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarSetModal({
  selectedCalendar,
  isOpen,
  onClose,
}: CalendarSetModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bannerUpdateModal"
      overlayClassName="bannerUpdateOverlay"
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mr-2 text-3xl text-black hover:text-gray-600"
        aria-label="Close"
      >
        &times;
      </button>
    </Modal>
  );
}

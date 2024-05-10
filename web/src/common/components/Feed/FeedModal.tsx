import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { UUID } from 'crypto';

interface FeedModalProps {
  feedId: UUID | null;
  isOpen: boolean;
  onClose: () => void;
}

export default React.memo(function FeedModal({ feedId, isOpen, onClose }: FeedModalProps) {
  console.log(`FeedModal`, feedId);
  const handleClose = useCallback(() => {
    // setImages([]);
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={{
        content: {
          height: '80vh',
          width: '150vh',
          padding: 0,

          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
        },
      }}
    >
      <div>hello</div>
    </Modal>
  );
});

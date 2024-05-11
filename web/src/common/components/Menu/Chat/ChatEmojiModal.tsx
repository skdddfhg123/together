import React from 'react';

import { Image } from '@type/index';

interface ImageModalProps {
  isOpen: boolean;
  images: Image[];
  onSelectImage: (url: string) => void;
  onClose: () => void;
}

export default React.memo(function ImageModal({
  isOpen,
  images,
  onSelectImage,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="images-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`emoji-${index}`}
              onClick={() => onSelectImage(image)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

import React from 'react';

interface Image {
  url: string;
}

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
              src={image.url}
              alt={`emoji-${index}`}
              onClick={() => onSelectImage(image.url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

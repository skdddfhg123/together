import React from 'react';

import { Image } from '@type/index';

interface ImageProps {
  image: Image;
  onRemove: (id: string) => void;
}

function ImageItem({ image, onRemove }: ImageProps) {
  return (
    <div className="w-64 h-96 p-2 overflow-hidden border border-gray-300 rounded transition hover:border-red-300">
      <img
        className="w-full h-full object-contain"
        src={image.src}
        alt={`preview-${image.name}`}
        onClick={() => onRemove(image.src)}
      />
    </div>
  );
}

interface ImageListProps {
  images: Image[];
  onRemoveImage: (id: string) => void;
}

export default React.memo(function CreateFeedImageList({ images, onRemoveImage }: ImageListProps) {
  return (
    <div className="FLEX-verA items-center w-full h-full">
      {images.map((image) => (
        <ImageItem key={image.name} image={image} onRemove={onRemoveImage} />
      ))}
    </div>
  );
});

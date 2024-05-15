import React from 'react';
import { Tooltip } from 'react-tooltip';
import { ImageFile } from '@type/index';

interface ImageProps {
  image: ImageFile;
  onRemove: (id: string) => void;
}

function ImageItem({ image, onRemove }: ImageProps) {
  return (
    <div className="ANIMATION w-64 h-96 p-2 overflow-hidden border border-gray-300 rounded hover:border-red-300">
      <img
        data-tooltip-id="tooltip-remove"
        className="w-full h-full object-contain"
        src={image.src}
        alt={`preview-${image.name}`}
        onClick={() => onRemove(image.src)}
      />
    </div>
  );
}

interface ImageListProps {
  images: ImageFile[];
  onRemoveImage: (id: string) => void;
}

export default React.memo(function CreateFeedImageList({ images, onRemoveImage }: ImageListProps) {
  return (
    <div className="FLEX-verA items-center w-full h-full mb-10">
      {images.map((image) => (
        <ImageItem key={image.name} image={image} onRemove={onRemoveImage} />
      ))}
      <Tooltip
        id="tooltip-remove"
        data-tooltip-class-name="tooltip-box"
        place="bottom"
        content="눌러서 삭제할 수 있습니다."
        style={{ marginTop: '10px' }}
      />
    </div>
  );
});

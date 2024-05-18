import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { ImageFile } from '@type/index';

interface FeedImgCarouselProps {
  ImageList: ImageFile[] | null;
}

export default React.memo(function FeedImgCarousel({ ImageList }: FeedImgCarouselProps) {
  const [currIndex, setCurrIndex] = useState(0);
  const carouselRef = useRef<HTMLUListElement>(null);

  const handleSwipe = (direction: number) => {
    const newIndex = currIndex + direction;

    if (ImageList) {
      if (newIndex < 0 || newIndex >= ImageList?.length) {
        return;
      }

      setCurrIndex(newIndex);
      if (carouselRef.current !== null) {
        carouselRef.current.style.transition = 'all 0.5s ease-in-out';
      }
    }
  };

  useEffect(() => {
    if (carouselRef.current !== null) {
      carouselRef.current.style.transform = `translateX(-${currIndex * 100}%)`;
    }
  }, [currIndex]);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full h-full overflow-hidden">
        <button
          disabled={currIndex === 0}
          type="button"
          {...(currIndex === 0 ? { 'data-tooltip-id': 'tooltip-first' } : {})}
          data-tooltip-place="bottom-start"
          className={`
          absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 
          rounded-full text-xl font-black bg-gray-100 text-gray-500
          ${
            currIndex === 0
              ? 'cursor-not-allowed'
              : 'ANIMATION hover:scale-150 hover:text-custom-main'
          }`}
          onClick={() => handleSwipe(-1)}
        >
          &lt;
        </button>
        <button
          disabled={currIndex === ImageList?.length}
          type="button"
          {...(currIndex + 1 === ImageList?.length ? { 'data-tooltip-id': 'tooltip-last' } : {})}
          data-tooltip-place="bottom-end"
          className={`
          absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 
          rounded-full text-xl font-black bg-gray-100 text-gray-500
          
          ${
            currIndex + 1 === ImageList?.length
              ? 'cursor-not-allowed'
              : 'ANIMATION hover:scale-150 hover:text-custom-main'
          }`}
          onClick={() => handleSwipe(1)}
        >
          &gt;
        </button>
        <ul ref={carouselRef} className="flex w-full h-full">
          {ImageList?.map((image, idx) => (
            <li key={`${image}-${idx}`} className="FLEX-horizC p-10 flex-shrink-0 w-full h-full">
              <img
                className=" object-contain max-w-full max-h-full"
                src={image.imageSrc}
                alt="carousel-img"
              />
            </li>
          ))}
        </ul>
      </div>
      <Tooltip id="tooltip-first" data-tooltip-class-name="tooltip-box">
        <div>첫번째 사진입니다.</div>
      </Tooltip>
      <Tooltip id="tooltip-last" data-tooltip-class-name="tooltip-box">
        <div>마지막 사진입니다.</div>
      </Tooltip>
    </div>
  );
});

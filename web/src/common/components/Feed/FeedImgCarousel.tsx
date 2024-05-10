import React, { useState, useEffect, useRef } from 'react';

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
          type="button"
          className="
          absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 
          bg-gray-100 text-gray-500
          hover:scale-150 hover:text-custom-main transition duration-300 ease-in-out"
          onClick={() => handleSwipe(-1)}
        >
          &lt;
        </button>
        <button
          type="button"
          className="
          absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 
          bg-gray-100 text-gray-500
          hover:scale-150 hover:text-custom-main transition duration-300 ease-in-out"
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
    </div>
  );
});

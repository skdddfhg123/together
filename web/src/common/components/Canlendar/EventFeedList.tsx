import React, { useState, useCallback } from 'react';

import { EventFeed } from '@type/index';
import { useEventFeedListStore } from '@store/index';

import FeedModal from '@components/Feed/FeedModal';

export default React.memo(function EventFeedList() {
  const { eventFeedList } = useEventFeedListStore();
  const [feedModalOn, setFeedModalOn] = useState<boolean>(false);
  const [selectedFeedInfo, setSelectedFeedInfo] = useState<EventFeed | null>(null);

  const openFeedModal = useCallback((feedInfo: EventFeed | null) => {
    setSelectedFeedInfo(feedInfo);
    setFeedModalOn(true);
  }, []);

  const closeFeedModal = useCallback(() => {
    setFeedModalOn(false);
    setSelectedFeedInfo(null);
  }, []);

  return (
    <div className="relative h-1/2 rounded">
      <h3 className="sticky top-0 mx-auto bg-custom-main text-white text-xl text-center">Feed</h3>
      <main className="FLEX-horiz SCROLL-hide items-center w-full h-full py-3 space-y-3 rounded">
        {eventFeedList.length === 0 ? (
          <p className="mt-12 text-xl">피드를 등록해주세요</p>
        ) : (
          eventFeedList.map((event, idx) =>
            event.images.length === 0 ? (
              <div
                className="outline outline-gray-300 hover:outline-2 hover:outline-custom-light rounded"
                key={`no-Img-${idx}`}
                onClick={() => openFeedModal(event)}
              >
                사진 없음
              </div>
            ) : (
              <img
                className="w-36 h-36 object-cover text-center outline outline-gray-300 rounded
                transition-all duration-300 ease-in-out
                hover:object-contain hover:w-72 hover:h-72 hover:outline-2 hover:outline-custom-light"
                src={event.images[0]?.imageSrc}
                alt="피드 사진"
                key={event.feedId}
                onClick={() => openFeedModal(event)}
              />
            ),
          )
        )}
      </main>
      <FeedModal feedInfo={selectedFeedInfo} isOpen={feedModalOn} onClose={closeFeedModal} />
    </div>
  );
});

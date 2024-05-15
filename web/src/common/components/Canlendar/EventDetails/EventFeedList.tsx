import React, { useState, useCallback } from 'react';

import useToggle from '@hooks/useToggle';
import { EventFeed } from '@type/index';
import { useEventFeedListStore } from '@store/index';

import FeedModal from '@components/Feed/FeedModal';

export default React.memo(function EventFeedList() {
  const { eventFeedList } = useEventFeedListStore();
  const { isOn, toggle } = useToggle(false);
  const [selectedFeedInfo, setSelectedFeedInfo] = useState<EventFeed | null>(null);

  const openFeedModal = useCallback((feedInfo: EventFeed | null) => {
    setSelectedFeedInfo(feedInfo);
    toggle();
  }, []);

  const closeFeedModal = useCallback(() => {
    setSelectedFeedInfo(null);
    toggle();
  }, []);

  return (
    <div className="relative h-1/2 rounded">
      <h3 className="sticky top-0 mx-auto bg-custom-main text-white text-xl text-center">Feed</h3>
      <main className="FLEX-horiz SCROLL-hide items-center w-full h-full py-3 space-y-3 rounded">
        {eventFeedList.length === 0 ? (
          <p className="mt-12 text-xl">피드를 등록해주세요</p>
        ) : (
          eventFeedList.map((feed, idx) =>
            feed.images.length === 0 ? (
              <div
                className="outline outline-1 outline-gray-300 hover:outline-custom-light rounded"
                key={`no-Img-${idx}`}
                onClick={() => openFeedModal(feed)}
              >
                사진 없음
              </div>
            ) : (
              <img
                className="w-36 h-36 object-cover text-center outline outline-1 outline-gray-300 rounded
                ANIMATION hover:object-contain hover:w-72 hover:h-72 hover:outline-custom-light"
                src={feed.images[0]?.imageSrc}
                alt="피드 사진"
                key={feed.feedId}
                onClick={() => openFeedModal(feed)}
              />
            ),
          )
        )}
      </main>
      <FeedModal feedInfo={selectedFeedInfo} isOpen={isOn} onClose={closeFeedModal} />
    </div>
  );
});

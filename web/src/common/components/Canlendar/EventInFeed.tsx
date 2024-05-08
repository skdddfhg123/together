import React from 'react';

import { useEventFeedListStore } from '@store/index';

export default function EventInFeed() {
  const { eventFeedList } = useEventFeedListStore();

  // TODO 피드 눌렀을 때, 각 피드 이벤트 모달 띄우기
  // TODO 피드 모달에선 댓글 및 상세 정보 보여줘야함
  return (
    <div className="FLEX-horizC border rounded">
      {eventFeedList.length === 0 ? (
        <p>피드를 등록해주세요</p>
      ) : (
        eventFeedList.map((event, index) => (
          <img
            className="w-24"
            src={event.images[0].imageSrc}
            alt="피드"
            key={`event-image-${index}`}
          />
        ))
      )}
    </div>
  );
}

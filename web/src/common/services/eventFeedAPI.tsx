import { AxiosError } from 'axios';
import { UUID } from 'crypto';

import * as API from '@utils/api';
import { reqEventFeed, EventFeed } from '@type/index';
import { useEventFeedListStore } from '@store/index';

interface FeedImage {
  imageSrc: string;
}

export async function getAllFeedInEvent(groupEventId: UUID) {
  try {
    const { data: res } = await API.get(`/feed/get/${groupEventId}`);
    if (!res) throw new Error(`FEED - getAllFeedInGroup 실패 (DB 피드 받아오기 실패)`);
    console.log(`FEED - getAllFeedInGroup 성공 :`, res);

    useEventFeedListStore.getState().setEventFeedList(res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - getAllFeedInGroup 실패 :`, data); //debug//
      alert('전체 피드를 가져오지 못했습니다.');
    }
  }
}

export async function getOneFeed(feedId: UUID) {
  try {
    const { data: res } = await API.get(`/feed/get/detail/${feedId}`);
    if (!res) throw new Error(`FEED - getOneFeed 실패 (DB 피드 받아오기 실패)`);

    console.log(`FEED - getOneFeed 성공 :`, res);
    alert('피드를 가져왔습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - getOneFeed 실패 :`, data); //debug//
      alert('피드를 가져오지 못했습니다.');
    }
  }
}

export async function createEventFeed({ groupEventId, content, images }: reqEventFeed) {
  try {
    const feedData = new FormData();
    feedData.append('feedType', '1');
    feedData.append('title', 'Title');
    feedData.append('content', content);

    // images는 File 배열이어야 합니다.
    images.forEach((image) => {
      feedData.append('images', image.file);
    });

    const { data: res } = await API.post(`/feed/create/${groupEventId}`, feedData);
    if (!res) throw new Error(`FEED - createEventFeed 실패 (DB 피드 생성 실패)`);
    console.log(`FEED - createEventFeed 성공 :`, res.feedImages);

    const EventFeeds = useEventFeedListStore.getState().eventFeedList;
    useEventFeedListStore.getState().setEventFeedList([
      ...EventFeeds,
      {
        feedId: res.feed.feedId,
        title: res.feed.title,
        content: res.feed.content,
        images: res.feedImages.map((img: FeedImage) => ({ imageSrc: img.imageSrc })),
        createdAt: res.feed.createdAt,
        userProfile: res.feed.user.thumnail,
        nickname: res.feed.user.nickname,
      },
    ]);

    alert('피드가 등록되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - createEventFeed 실패 :`, data); //debug//
      alert('피드 등록에 실패했습니다.');
    }
  }
}

export async function updateEventFeed({
  feedId,
  feedType,
  title,
  content,
  // images,    //TODO 업데이트할 이미지 URI 전송하기
}: reqEventFeed) {
  try {
    const { data: res } = await API.patch(`/feed/update/${feedId}`, {
      feedType: feedType || 1,
      title, //TODO default로 'Title'로 저장했기 때문에 Title로 전달
      content,
      // images
    });
    if (!res) throw new Error(`FEED - updateEventFeed 실패 (DB 피드 생성 실패)`);
    console.log(`FEED - updateEventFeed 성공 :`, res);
    alert('피드를 수정했습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - updateEventFeed 실패 :`, data); //debug//
      alert('피드 수정에 실패했습니다.');
    }
  }
}

export async function removeEventFeed({ feedId }: EventFeed) {
  try {
    const { data: res } = await API.patch(`/feed/create/${feedId}`);
    if (!res) throw new Error(`FEED - updateGroupEvent 실패 (DB 피드 생성 실패)`);
    console.log(`FEED - updateGroupEvent 성공 :`, res);
    alert('피드를 삭제했습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - updateGroupEvent 실패 :`, data); //debug//
      alert('피드 생성에 실패했습니다.');
    }
  }
}

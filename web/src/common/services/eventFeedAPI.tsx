import { AxiosError } from 'axios';
import { UUID } from 'crypto';

import * as API from '@utils/api';
import { ImageFile, reqEventFeed, EventFeed, reqComment } from '@type/index';
import { useEventFeedListStore } from '@store/index';

interface FeedImage {
  imageSrc: string;
}

export async function getAllFeedInEvent(groupEventId: UUID) {
  try {
    const { data: res } = await API.get(`/feed/get/groupevent/${groupEventId}`);
    if (!res) throw new Error(`FEED - getAllFeedInEvent 실패 (DB 피드 불러오기 실패)`);
    console.log(`FEED - getAllFeedInEvent 성공 :`, res); //debug//

    useEventFeedListStore.getState().setEventFeedList(res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - getAllFeedInEvent 실패 :`, data); //debug//
      alert('전체 피드를 가져오지 못했습니다.');
    }
  }
}

export async function getOneFeed(feedId: UUID) {
  try {
    const { data: res } = await API.get(`/feed/get/detail/${feedId}`);
    if (!res) throw new Error(`FEED - getOneFeed 실패 (DB 피드 불러오기 실패)`);

    console.log(`FEED - getOneFeed 성공 :`, res); //debug//

    return res;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - getOneFeed 실패 :`, data); //debug//
      alert('피드를 가져오지 못했습니다.');
    }
  }
}

export async function createEventFeed({
  groupEventId,
  feedType,
  title,
  content,
  images,
}: reqEventFeed) {
  try {
    const feedData = new FormData();
    feedData.append('feedType', feedType.toString());
    feedData.append('title', title);
    feedData.append('content', content);

    images.forEach((img: ImageFile) => {
      if (img.file) feedData.append('images', img.file);
    });

    const { data: res } = await API.post(`/feed/create/${groupEventId}`, feedData);
    if (!res) throw new Error(`FEED - createEventFeed 실패 (DB 피드 생성 실패)`);
    console.log(`FEED - createEventFeed 성공 :`, res); //debug//

    const EventFeeds = useEventFeedListStore.getState().eventFeedList;
    useEventFeedListStore.getState().setEventFeedList([
      ...EventFeeds,
      {
        feedId: res.feed.feedId,
        feedType: res.feed.feedType,
        title: res.feed.title,
        content: res.feed.content,
        images: res.feedImages.map((img: FeedImage) => ({ imageSrc: img.imageSrc })),
        createdAt: res.feed.createdAt,
        thumbnail: res.feed.user.thumbnail,
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
}: EventFeed) {
  try {
    const { data: res } = await API.patch(`/feed/update/${feedId}`, {
      feedType: feedType || 1,
      title,
      content,
      // images
    });
    if (!res) throw new Error(`FEED - updateEventFeed 실패 (DB 피드 수정 실패)`);
    console.log(`FEED - updateEventFeed 성공 :`, res); //debug//
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
    if (!res) throw new Error(`FEED - removeEventFeed 실패 (DB 피드 삭제 실패)`);
    console.log(`FEED - removeEventFeed 성공 :`, res); //debug//
    alert('피드를 삭제했습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`FEED - removeEventFeed 실패 :`, data); //debug//
      alert('피드 삭제에 실패했습니다.');
    }
  }
}

// ************************************ 댓글

export async function createFeedComment({ feedId, content }: reqComment) {
  try {
    const res = await API.post(`/feed/comment/create/${feedId}`, { content });
    if (!res) throw new Error('COMMENT - createFeedComment 실패 : (DB 댓글 등록 실패)');
    console.log(`COMMENT - createFeedComment 성공 :`, res); //debug//
    alert('댓글이 등록되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`COMMENT - createFeedComment 실패 :`, data); //debug//
      alert('댓글 등록에 실패했습니다.');
    }
  }
}

export async function getFeedComment(feedId: UUID) {
  try {
    const { data: res } = await API.get(`/feed/comment/${feedId}`);
    if (!res) throw new Error('COMMENT - getFeedComment 실패 : (DB 댓글 불러오기 실패)');
    console.log(`COMMENT - getFeedComment 성공 :`, res); //debug//

    return res;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`COMMENT - getFeedComment 실패 :`, data); //debug//
      alert('댓글 불러오기에 실패했습니다.');
    }
  }
}

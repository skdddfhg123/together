import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';

import * as FEED from '@services/eventFeedAPI';
import { Comment, EventFeed } from '@type/index';
import FeedImgCarousel from './FeedImgCarousel';

interface FeedModalProps {
  feedInfo: EventFeed | null;
  isOpen: boolean;
  onClose: () => void;
}

export default React.memo(function FeedModal({ feedInfo, isOpen, onClose }: FeedModalProps) {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const commentRef = useRef<HTMLInputElement>(null);

  console.log(`modal`, feedInfo);
  const handleClose = useCallback(() => {
    // setImages([]);
    onClose();
  }, [onClose]);

  const fetchCommntList = useCallback(async () => {
    const feedId = feedInfo?.feedId;
    if (!feedId) return alert('피드 정보를 가져오지 못했습니다.');
    const comments = await FEED.getFeedComment(feedId);
    setCommentList(comments);
  }, [feedInfo]);

  const submitNewComment = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && commentRef.current) {
        const content = commentRef.current.value;
        if (!content.trim()) return;

        const feedId = feedInfo?.feedId;
        if (!feedId) return alert('피드 정보를 가져오지 못했습니다.');
        await FEED.createFeedComment({ feedId, content });
        commentRef.current.value = '';
        fetchCommntList();
      }
    },
    [feedInfo, fetchCommntList],
  );

  useEffect(() => {
    fetchCommntList();
  }, []);

  return (
    <Modal
      className="feedModal"
      overlayClassName="feedOverlay"
      isOpen={isOpen}
      onRequestClose={handleClose}
    >
      {feedInfo ? (
        <div className="FLEX-ver h-full">
          <FeedImgCarousel ImageList={feedInfo.images} />
          <main className="w-1/2 h-full border-l">
            <section key="content-section" className="relative space-y-4 h-1/3 border-b">
              <header className="FLEX-ver sticky top-0 h-16 p-3 items-center">
                {feedInfo.thumbnail ? (
                  <img src={feedInfo.thumbnail} alt="프로필" />
                ) : (
                  <p className="text-gray-700 w-24">{feedInfo.nickname}</p>
                )}
                <h1 className="text-4xl font-bold">{feedInfo.title}</h1>
              </header>
              <p className="h-2/3 text-2xl text-gray-700">{feedInfo.content}</p>
              <div className=" text-gray-500">{new Date(feedInfo.createdAt).toLocaleString()}</div>
            </section>
            <section key="comment-section" className="h-2/3">
              <div>
                {commentList.length > 0 ? (
                  <ul>
                    {commentList.map((cmt) => (
                      <li key={cmt.feedCommentId}>
                        {cmt.thumbnail ? <p>{cmt.thumbnail}</p> : <p>{cmt.nickname}</p>}
                        <p>{cmt.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>댓글이 없습니다.</div>
                )}
              </div>
              <form>
                <input ref={commentRef} className="INPUT" onSubmit={submitNewComment} />
                <button type="submit">전송</button>
              </form>
            </section>
          </main>
        </div>
      ) : (
        <p>Loading feed details...</p>
      )}
    </Modal>
  );
});

// interface FeedModalProps {
//   feedId: UUID | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default React.memo(function FeedModal({ feedId, isOpen, onClose }: FeedModalProps) {
//   console.log(`FeedModal`, feedId);
//   const [feedInfo, setFeedInfo] = useState<EventFeed | null>(null);

//   useEffect(() => {
//     fetchFeedDetails();
//   }, [feedId]);

//   const fetchFeedDetails = async () => {
//     if (!feedId) return;
//     const res = await FEEd.getOneFeed(feedId);
//     console.log(`res`, res);
//     setFeedInfo(res);
//   };
//   const handleClose = useCallback(() => {
//     // setImages([]);
//     onClose();
//   }, [onClose]);

// {feedInfo.images && feedInfo.images.length > 0 ? (
//   feedInfo.images.map((img, idx) => (
//     <img key={idx} src={img.imageSrc} alt="Feed Image" className="1/2" />
//   ))
// ) : (
//   <div>이미지가 없습니다.</div>
// )}

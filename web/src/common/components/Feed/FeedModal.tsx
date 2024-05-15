import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

import sendToast from '@hooks/sendToast';
import * as FEED from '@services/eventFeedAPI';

import { Comment, EventFeed } from '@type/index';

import FeedImgCarousel from '@components/Feed/FeedImgCarousel';

import '@styles/modalStyle.css';

interface FeedModalProps {
  feedInfo: EventFeed | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedModal({ feedInfo, isOpen, onClose }: FeedModalProps) {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const commentRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const fetchCommntList = useCallback(async () => {
    const feedId = feedInfo?.feedId;
    if (!feedId) return sendToast('error', '피드 정보를 가져오지 못했습니다.');
    const comments = await FEED.getFeedComment(feedId);
    setCommentList(comments);
  }, [feedInfo]);

  useEffect(() => {
    if (isOpen && feedInfo) {
      fetchCommntList();
    }
  }, [isOpen, fetchCommntList]);

  const submitNewComment = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (commentRef.current && feedInfo?.feedId) {
        const content = commentRef.current.value;
        if (!content.trim()) return;

        await FEED.createFeedComment({ feedId: feedInfo.feedId, content });
        commentRef.current.value = '';
        fetchCommntList();
      }
    },
    [feedInfo, fetchCommntList],
  );

  function formatDate(Feeddate: string) {
    const date = parseISO(Feeddate);

    return format(date, 'yy년 M월 d일, H시 m분', { locale: ko });
  }

  return (
    <Modal
      className="feedModal"
      overlayClassName="feedOverlay"
      isOpen={isOpen}
      onRequestClose={handleClose}
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mr-2 text-3xl text-black hover:text-gray-600"
        aria-label="Close"
      >
        &times;
      </button>
      {feedInfo ? (
        <div className="FLEX-ver h-full">
          <FeedImgCarousel ImageList={feedInfo.images} />
          <main className="w-1/2 h-full border-l">
            <section
              key="content-section"
              className="FLEX-horizC w-full h-2/5 space-y-4 p-2 border-b"
            >
              <header key="author" className="FLEX-horizC mx-auto text-center h-1/3">
                {feedInfo.thumbnail ? (
                  <img className="max-w-24" src={feedInfo.thumbnail} alt="프로필" />
                ) : (
                  <div className="text-gray-700 text-xl w-24">{feedInfo.nickname}</div>
                )}
              </header>
              <div className="overflow-auto scroll-y-auto mx-auto text-left text-xl h-2/3 w-full">
                {feedInfo.content}
              </div>
              <div className="w-full text-left text-gray-400">{formatDate(feedInfo.createdAt)}</div>
            </section>
            <section className="flex flex-col h-3/5 p-2">
              <div className="overflow-y-auto flex-1">
                {commentList.length > 0 ? (
                  <ul>
                    {commentList.map((cmt) => (
                      <li key={cmt.feedCommentId} className="flex flex-col p-2 border-b">
                        <div className="flex items-center space-x-2">
                          {cmt.thumbnail ? (
                            <img
                              src={cmt.thumbnail}
                              alt={cmt.nickname}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <span className="font-semibold">{cmt.nickname}</span>
                          )}
                          <p className="flex-1">{cmt.content}</p>
                        </div>
                        <div className="text-sm text-gray-400 mt-1 pl-16">
                          {formatDate(cmt.createdAt)}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500">댓글이 없습니다.</div>
                )}
              </div>
              <form
                onSubmit={submitNewComment}
                className="sticky bottom-0 bg-custom-line p-3 shadow-md"
              >
                <input
                  ref={commentRef}
                  className="input w-5/6 flex-1 rounded p-2 mr-2 border-gray-300"
                  maxLength={150}
                  placeholder="댓글을 입력해주세요."
                />
                <button type="submit" className="bg-custom-main text-white rounded p-2">
                  전송
                </button>
              </form>
            </section>
          </main>
        </div>
      ) : (
        <p>Loading feed details...</p>
      )}
    </Modal>
  );
}

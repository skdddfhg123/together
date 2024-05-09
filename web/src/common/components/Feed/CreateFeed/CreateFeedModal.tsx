import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { UUID } from 'crypto';

import * as FEED from '@services/eventFeedAPI';
import { ImageFile, reqEventFeed } from '@type/index';
import CreateFeedImageList from '@components/Feed/CreateFeed/createFeedImgList';

interface CreatedFeedProps {
  groupEventId: UUID | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFeedModal({ groupEventId, isOpen, onClose }: CreatedFeedProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setImages([]);
    onClose();
  }, [groupEventId]);

  const submitNewFeed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupEventId) {
      alert('피드를 등록할 일정을 못찾았습니다. 다시 선택해주세요.');
      onClose();
      return;
    }
    const content = contentRef.current?.value;
    if (!content) return alert('내용을 입력해주세요.');

    const feedData: reqEventFeed = {
      groupEventId: groupEventId,
      content,
      images: images,
    };

    FEED.createEventFeed(feedData);
    setImages([]);
    onClose();
  };

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (images.length >= 5) return alert('이미지는 최대 5장까지 선택 가능합니다.');

      if (event.target.files && event.target.files.length > 0) {
        const fileArray = Array.from(event.target.files).slice(0, 5 - images.length);
        const newImages = fileArray.map((file) => ({
          src: URL.createObjectURL(file),
          name: file.name,
          file: file,
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    },
    [images.length],
  );

  const handleRemoveImage = useCallback((id: string) => {
    setImages((images) => images.filter((image) => image.src !== id));
  }, []);

  //TODO 이미지 케로셀로 하면 좋을듯 (Component Carousel)
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          height: '80vh',
          width: '150vh',
          padding: 0,

          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
        },
      }}
    >
      <form
        className="FLEX-horizC w-full h-full"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitNewFeed}
      >
        <fieldset className="FLEX-horizC w-full h-2/3">
          <legend hidden>피드 사진</legend>
          <CreateFeedImageList images={images} onRemoveImage={handleRemoveImage} />
          <section className="FLEX-verA mb-4 items-center">
            <label
              htmlFor="image_input"
              className="my-2 py-2 px-3 mr-2 cursor-pointer border rounded text-gray-600"
            >
              사진 업로드 : {`${images.length} 개`}
            </label>
            <input
              id="image_input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="sr-only"
            />
            <span className="text-gray-400">
              {images.length >= 5 ? '업로드 가능한 이미지는 최대 5장입니다.' : ''}
            </span>
          </section>
        </fieldset>
        <fieldset className="FLEX-horizC w-full">
          <legend hidden>피드 본문</legend>
          <label hidden>Content</label>
          <textarea
            className="INPUT w-3/5 h-40 p-1.5 resize-none"
            ref={contentRef}
            maxLength={350}
          ></textarea>
        </fieldset>
        <section className="FLEX-verA w-80 m-6 text-xl">
          <button className="BTN w-28" onClick={onClose}>
            닫기
          </button>
          <button type="submit" className="BTN w-28">
            저장
          </button>
        </section>
      </form>
    </Modal>
  );
}

import React, { useState, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import * as CALENDAR from '@services/calendarAPI';
import { Calendar } from '@type/index';
import useToast from '@hooks/useToast';

import '@styles/modalStyle.css';

interface CalendarBannerModalProps {
  selectedCalendar: Calendar | 'All';
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarBannerModal({
  selectedCalendar,
  isOpen,
  onClose,
}: CalendarBannerModalProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setBannerFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
    }
  };

  const uploadWebBanner = async () => {
    if (!selectedCalendar || selectedCalendar === 'All')
      return useToast('warning', '그룹 캘린더를 선택해주세요.');

    if (!cropperRef.current?.cropper) return;

    const canvas = cropperRef.current.cropper.getCroppedCanvas();

    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append('bannerFile', blob, 'cropped_image.png');

        await CALENDAR.updateGroupBanner(selectedCalendar.calendarId, formData);
        await CALENDAR.getMyAllCalendar();
      }
    }, 'image/png');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bannerUpdateModal"
      overlayClassName="bannerUpdateOverlay"
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mr-2 text-3xl text-black hover:text-gray-600"
        aria-label="Close"
      >
        &times;
      </button>
      <div
        className={`p-4 w-full h-full ${
          dragActive ? ' bg-gray-100 border-dashed border-4 border-blue-500' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="FLEX-horizC mb-20">
          <h1 className="mb-10 text-2xl font-semibold">Preview</h1>
          <div className="img-preview w-full h-96 overflow-hidden border rounded" />
        </div>
        <div className="FLEX-horizC">
          <label
            htmlFor="file_input"
            className="BTN py-2 px-4 mb-4 rounded-md cursor-pointer text-2xl bg-custom-light text-white hover:bg-blue-600"
          >
            사진 업로드
          </label>
          <input
            id="file_input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <h2 className="mb-4 text-center text-gray-400">드래그도 가능해요 !</h2>
        <div className="relative w-full">
          <Cropper
            src={bannerFile ? URL.createObjectURL(bannerFile) : ''}
            style={{ height: 200, width: '100%' }}
            initialAspectRatio={16 / 2}
            guides={false}
            cropBoxResizable={true}
            dragMode="move"
            aspectRatio={16 / 2}
            viewMode={2}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            preview=".img-preview"
            ref={cropperRef}
          />
        </div>
        <div className="FLEX-verA mx-auto w-1/2 space-x-4 mt-10">
          <button
            onClick={onClose}
            className="BTN px-4 py-2 rounded-md ANI-btn hover:bg-red-500 text-2xl"
          >
            취소하기
          </button>
          <button onClick={uploadWebBanner} className="BTN px-4 py-2 rounded-md ANI-btn text-2xl">
            업로드하기
          </button>
        </div>
      </div>
    </Modal>
  );
}

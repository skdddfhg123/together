import React, { useState, useRef, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { ImFilePicture } from 'react-icons/im';

import * as CHAT from '@services/ChatAndEmojiAPI';
import { Calendar } from '@type/index';

interface TabEmojiUploadProps {
  selectedCalendar: Calendar | 'All';
  onClose: () => void;
}

export default function TabEmojiUpload({ selectedCalendar, onClose }: TabEmojiUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(''); // 파일 이름을 저장할 상태
  const [emojiName, setEmojiName] = useState('::');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const [isValid, setIsValid] = useState(true); // 유효성 검사 결과 상태

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 커서를 콜론 사이에 위치시킵니다.
    const input = emojiNameInputRef.current;
    if (input) {
      input.focus();
      input.setSelectionRange(1, 1);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
    setFileName(file ? file.name : ''); // 파일 이름 설정

    if (file) {
      setFileName(file.name); // 파일 이름 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
      setFileName(''); // 파일이 없을 때 파일 이름 초기화
    }
  };

  const handleEmojiNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    const modifiedValue = newValue.replace(/:/g, ''); // 모든 콜론을 제거
    const isValid = /^[a-z_-]+$/.test(modifiedValue);

    setEmojiName(`:${modifiedValue}:`);
    setIsValid(isValid);

    if (emojiNameInputRef.current) {
      const cursorPosition = emojiNameInputRef.current.selectionStart;
      setTimeout(() => {
        emojiNameInputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택해 주세요.');
    if (!selectedCalendar || selectedCalendar === 'All')
      return alert('그룹 캘린더를 선택해주세요.');

    const formData = new FormData();
    formData.append('emojiFile', file);
    formData.append('emojiName', emojiName);

    CHAT.uploadGroupEmoji({ calendarId: selectedCalendar.calendarId, emojiFormData: formData });
    onClose();
  };

  // 사용자 지정 버튼을 사용하여 파일을 선택할 수 있도록 합니다.
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex ">
      <div className="relative bg-white p-0 w-full  h-5/6 overflow-visible">
        <div className="mb-10  text-gray-800">
          그룹 이모지는 해당 그룹 캘린더 내부에서 모든 사용자가 사용할 수 있습니다. 그룹 이모지
          리스트 탭에서 우리 그룹 캘린더의 이모지를 살펴볼 수 있습니다.
        </div>
        <div className="text-lg font-bold text-black-500 mt-5">1. 이미지 파일 업로드</div>
        <div className="mb-4 ml-4 text-gray-500">이미지 파일은 108 * 108 pixel</div>
        <div className="flex p-0 pl-3 ml-4">
          <div className="flex  w-full max-w-xs">
            <div
              className="w-1/2 bg-gray-200 cursor-pointer flex-grow-0"
              style={{ height: '108px', width: '108px' }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full bg-gray-200 flex items-center justify-center"
                  style={{ color: '#333' }}
                >
                  <ImFilePicture size={50} />
                </div>
              )}
            </div>
            <div className="pl-5 flex flex-col">
              <span className="text-lg mb-1 mt-auto text-gray-500">
                {fileName || '이모지 선택'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition duration-150 ease-in-out font-bold"
                onClick={triggerFileSelect}
              >
                이미지 업로드
              </button>
            </div>
          </div>
        </div>
        <hr className="my-4 border-t border-gray-300" />
        <div className="text-lg font-bold text-black-500">2. 이모지 이름</div>
        <div className="mb-0 ml-3 text-gray-500">
          이모지 이름은 서비스 전체 단위에서 중복 허용이 되지 않습니다.
        </div>
        <div>
          <div className="relative flex items-center w-full my-4">
            <input
              ref={emojiNameInputRef}
              type="text"
              className={`ml-4 mr-4 p-2 border flex-grow rounded-lg shadow-sm focus:outline-none ${isValid ? 'border-gray-300 focus:ring-blue-200 focus:border-blue-300' : 'border-red-500 focus:ring-red-500'}`}
              placeholder=":emojiname:"
              value={emojiName.replace(/:/g, '')}
              onChange={handleEmojiNameChange}
              style={{ minHeight: '1em' }}
            />
          </div>
          {!isValid && (
            <div className="flex items-center text-red-500 mt-1 ml-4 mr-4 ">
              <FiAlertCircle size={24} className="mr-2" /> {/* 경고 아이콘 */}
              <span>
                이름은 소문자만 포함해야 하며, 공백, 마침표 또는 대부분의 문장 부호를 포함할 수
                없습니다.
              </span>
            </div>
          )}
          {isNameValid === false && (
            <div className="text-red-500 text-sm mt-1">이미 사용 중인 이름입니다.</div>
          )}
        </div>
        <div className="flex justify-end mt-12">
          <button
            className="font-bold px-7 py-1 border ml-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition duration-150 ease-in-out"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className={`font-bold px-7 py-1 border ml-2 border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition duration-150 ease-in-out ${
              fileName && emojiName
                ? 'bg-custom-light hover:bg-custom-main text-black hover:text-white'
                : 'bg-gray-300 hover:bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!fileName || !emojiName}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';

const TabEmojiFeedUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [emojiName, setEmojiName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkName = async () => {
      if (!emojiName) {
        setIsNameValid(null);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/emoji/confirmName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: emojiName }),
        });

        const { isAvailable } = await response.json();
        setIsNameValid(isAvailable);
      } catch (error) {
        console.error('이름 중복 검사 중 에러 발생', error);
        setIsNameValid(false); // 에러 발생 시 중복으로 간주
      }
    };

    checkName();
  }, [emojiName]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl('');
      }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해 주세요.');
      return;
    }

    // 이름이 유효하지 않을 때 경고 메시지를 띄우고 업로드를 중단합니다.
    if (!isNameValid) {
        alert('이미 사용 중인 이름입니다. 다른 이름을 입력해 주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('emojiFile', file);
    formData.append('emojiName', emojiName);

    try {
      const response = await fetch('http://localhost:3000/emoji/create/e2f247e8-371b-4d65-b601-b405641d943e', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('업로드 성공: ' + JSON.stringify(result.emojiName));

        setFile(null);
        setPreviewUrl('');
        setEmojiName('');
        setIsNameValid(null); // 이름 유효성 상태도 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // 파일 입력 필드 초기화
        }
      } else {
        alert('업로드 실패: ' + response.status);
      }
    } catch (error) {
      console.error('업로드 중 에러 발생', error);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      <div className="col-span-1">
        <div className="w-full h-24 bg-gray-200 cursor-pointer">
          <img src={previewUrl} alt="Preview" className={previewUrl ? "w-full h-full object-cover" : "hidden"} />
        </div>
      </div>
      <div className="col-span-4 flex flex-col items-center justify-center">
        <input ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*" className="mb-4"/>
        <textarea className="p-2 border border-gray-300 w-full" placeholder="Enter emoji name here..."
          value={emojiName} onChange={e => setEmojiName(e.target.value)}></textarea>
        {isNameValid === false && (
          <div className="text-red-500 text-sm mt-1">이미 사용 중인 이름입니다.</div>
        )}
        <button className={`mt-4 px-4 py-2 rounded text-white ${isNameValid ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`} 
        onClick={handleUpload}
        disabled={!isNameValid}  // isNameValid가 true일 때만 활성화
        >이모지 등록</button>
      </div>
    </div>
  );
};

export default TabEmojiFeedUpload;

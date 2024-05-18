import React, { useEffect, useState, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { set } from 'date-fns';
import LabelIcon from '@mui/icons-material/Label';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';

import * as CALENDAR from '@services/calendarAPI';
import * as REDIS from '@services/redisAPI';
import useUpdateModalStyle from '@hooks/useUpdateModalStyle';
import useToast from '@hooks/useToast';

import { Calendar, reqEvent } from '@type/index';
import { useUserInfoStore } from '@store/index';

import DetailModal from '@components/Event/CreateEvent/CreateEventDetail';
import '@styles/modalStyle.css';

interface EventModalProps {
  selectedCalendar: Calendar | 'All';
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  position: { x: number; y: number };
}

const colors = [
  { code: '#90CAF9', name: '딥 스카이 블루' },
  { code: '#A5D6A7', name: '에메랄드 그린' },
  { code: '#80DEEA', name: '모던 사이언' },
  { code: '#FFE082', name: '앰버 옐로우' },
  { code: '#EEEEEE', name: '그레이' },
  { code: '#FFCCBC', name: '코랄 핑크' },
  { code: '#F8BBD0', name: '프렌치 로즈' },
  { code: '#D1C4E9', name: '소프트 바이올렛' },
  { code: '#FFCDD2', name: '애플 레드' },
  { code: '#9FA8DA', name: '인디고 블루' },
];

const initialColor = colors.find((color) => color.code === '#90CAF9') || colors[0];

export default React.memo(function CreateEventSimple({
  selectedCalendar,
  isOpen,
  onClose,
  selectedDay,
  position,
}: EventModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const { userInfo } = useUserInfoStore();
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState<{ code: string; name: string }>(initialColor);
  const [title, setTitle] = useState<string>('');
  const [detailOpen, setDetailOpen] = useState(false);

  useUpdateModalStyle({ position, setModalStyle }); //* 모달 위치 계산 훅

  //****************? 핸들링 함수
  const handleDetailOpen = () => {
    if (titleRef.current?.value.trim()) setTitle(titleRef.current?.value.trim());
    setDetailOpen(true);
    onClose();
  };
  const handleDetailClose = () => setDetailOpen(false);

  const handleColorClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorSelect = (newColor: { code: string; name: string }) => {
    setColor(newColor);
    setShowColorPicker(false);
  };

  const submitNewEvent = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const title = titleRef.current?.value.trim();

      if (!title) return useToast('default', '일정 제목이 비어있습니다.');
      if (!userInfo) return useToast('default', '유저 정보를 찾을 수 없습니다. 새로고침해주세요.');
      if (!selectedDay) return useToast('default', '선택된 날이 없습니다.');
      if (selectedCalendar === 'All') {
        onClose();
        return useToast('default', '일정을 등록할 그룹 캘린더를 선택해주세요.');
      }

      const startAtDate = set(selectedDay, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      const endAtDate = set(selectedDay, { hours: 23, minutes: 30, seconds: 0, milliseconds: 0 });

      const eventData: reqEvent = {
        groupCalendarId: selectedCalendar.calendarId,
        title: title,
        color: color.code,
        member: null,
        startAt: startAtDate,
        endAt: endAtDate,
      };

      const res = await CALENDAR.createGroupSimpleEvent(eventData);
      if (res) {
        await CALENDAR.getGroupAllEvents(selectedCalendar);
        await REDIS.MessagePost({ selectedCalendar: selectedCalendar, method: `일정을 등록` });
      }
      setTitle('');
      onClose();
    },
    [color.code, onClose, selectedCalendar, selectedDay, userInfo],
  );

  //****************? 컴포넌트 초기화

  useEffect(() => {
    setTitle('');
    setColor(initialColor);
  }, [onClose, userInfo]);

  return (
    <>
      <Modal
        className="eventModal"
        overlayClassName="evevntOverlay"
        isOpen={isOpen}
        onRequestClose={onClose}
        style={{ content: { ...modalStyle } }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitNewEvent(e);
          }}
          className="w-full px-3 flex justify-between items-center"
        >
          <div className="relative flex items-center w-full">
            <LabelIcon
              style={{ color: color.code, marginRight: '8px' }}
              onClick={handleColorClick}
            />
            <Input type="text" placeholder="제목" ref={titleRef} color={color.code} />
            <IconButton style={{ color: color.code }} onClick={handleDetailOpen}>
              <MoreVertIcon />
            </IconButton>
            {showColorPicker && (
              <ColorPicker>
                {colors.map((colorOption) => (
                  <ColorOption key={colorOption.code} color={colorOption.code}>
                    <ColorSwatch color={colorOption.code} />
                    <ColorName color={colorOption.code}>{colorOption.name}</ColorName>
                    <ColorRadio
                      type="radio"
                      name="color"
                      value={colorOption.code}
                      checked={color.code === colorOption.code}
                      onChange={() => handleColorSelect(colorOption)}
                    />
                  </ColorOption>
                ))}
              </ColorPicker>
            )}
          </div>
        </form>
      </Modal>
      <DetailModal
        isOpen={detailOpen}
        onClose={handleDetailClose}
        selectedCalendar={selectedCalendar}
        color={color.code}
        colors={colors}
        title={title}
        setColor={(newColor) => setColor(colors.find((c) => c.code === newColor) || initialColor)}
      />
    </>
  );
});

const Input = styled.input<{ color: string }>`
  flex-grow: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: ${(props) => props.color};

  &::placeholder {
    color: ${(props) => props.color};
  }
`;

const ColorPicker = styled.div`
  display: block;
  position: absolute;
  top: 40px;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 10;
  padding: 8px;
`;

const ColorOption = styled.label<{ color: string }>`
  display: flex;
  align-items: center;
  padding: 4px;
  margin-bottom: 4px;
  cursor: pointer;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 10px;
  height: 20px;
  background-color: ${(props) => props.color};
  border-radius: 3px;
  margin-right: 8px;
`;

const ColorName = styled.span<{ color: string }>`
  flex-grow: 1;
  color: ${(props) => props.color};
  filter: saturate(2.8) brightness(0.7) contrast(1.3);
`;

const ColorRadio = styled.input`
  margin-left: auto;
`;

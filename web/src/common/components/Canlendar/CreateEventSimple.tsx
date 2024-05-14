import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { formatISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import LabelIcon from '@mui/icons-material/Label';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';

import * as CALENDAR from '@services/calendarAPI';
import * as REDIS from '@services/redisAPI';
import useUpdateModalStyle from '@hooks/useUpdateModalStyle';

import { Calendar, DefaultEvent, reqEvent } from '@type/index';
import { useUserInfoStore } from '@store/index';

import '@styles/modalStyle.css';
import DetailModal from './CreateEventDetail';

interface EventModalProps {
  selectedCalendar: Calendar | 'All';
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  position: { x: number; y: number };
}

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

const ColorPicker = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
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

const colors = [
  { code: '#90CAF9', name: '딥 스카이 블루' }, // 더 연한 파란색
  { code: '#A5D6A7', name: '에메랄드 그린' }, // 더 연한 녹색
  { code: '#80DEEA', name: '모던 사이언' },   // 더 연한 시안색
  { code: '#FFE082', name: '앰버 옐로우' },   // 더 연한 황금색
  { code: '#EEEEEE', name: '그레이' },       // 더 연한 회색
  { code: '#FFCCBC', name: '코랄 핑크' },     // 더 연한 코랄색
  { code: '#F8BBD0', name: '프렌치 로즈' },   // 더 연한 분홍색
  { code: '#D1C4E9', name: '소프트 바이올렛' }, // 더 연한 보라색
  { code: '#FFCDD2', name: '애플 레드' },     // 더 연한 빨간색
  { code: '#9FA8DA', name: '인디고 블루' }    // 더 연한 인디고색
];


const initialColor = colors.find(color => color.code === '#1E90FF') || colors[0];

export default React.memo(function CreateEventSimple({
  selectedCalendar,
  isOpen,
  onClose,
  selectedDay,
  position,
}: EventModalProps) {
  const { userInfo } = useUserInfoStore();
  const titleRef = useRef<HTMLInputElement>(null);
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState<{ code: string, name: string }>(initialColor);
  const [title, setTitle] = useState<string>('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [member, setMember] = useState<string[]>(userInfo ? [userInfo.useremail] : []);

  useUpdateModalStyle({ position, setModalStyle });

  const handleDetailOpen = () => setDetailOpen(true);
  const handleDetailClose = () => setDetailOpen(false);
  const handleEventData = (data: { selectedEmails: string[] }) => {
    setMember(data.selectedEmails);
  };

  useEffect(() => {
    if (member.length > 0) {
      submitNewEvent();
    }
  }, [member]);

  useEffect(() => {
    setTitle('');
    setColor(initialColor);
    setMember(userInfo ? [userInfo.useremail] : []);
  }, [onClose]);

  const submitNewEvent = async () => {
    const title = titleRef.current?.value.trim();

    if (!title) return alert('일정 제목이 비어있습니다.');
    if (!selectedDay) return alert('선택된 날이 없습니다.');
    if (!userInfo) return alert('유저 정보를 찾을 수 없습니다. 새로고침해주세요.');
    if (selectedCalendar === 'All') {
      onClose();
      return alert('일정을 등록할 그룹 캘린더를 선택해주세요.');
    }

    const eventData: reqEvent = {
      groupCalendarId: selectedCalendar.calendarId,
      title: title,
      color: color.code,
      member: member,
      startAt: formatISO(selectedDay, { representation: 'complete' }),
      endAt: formatISO(selectedDay, { representation: 'complete' }),
    };

    const res = await CALENDAR.createGroupEvent(eventData);
    if (res) {
      await CALENDAR.getGroupAllEvents(selectedCalendar);
      await REDIS.MessagePost({ channel: userInfo?.useremail, message: `일정 등록` });
    }
    setTitle('');
    onClose();
  };

  const handleColorClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorSelect = (newColor: { code: string, name: string }) => {
    setColor(newColor);
    setShowColorPicker(false);
  };

  const handleSave = () => {
    submitNewEvent();
    handleDetailClose();
  };

  return (
    <>
      <Modal
        className="eventModal"
        overlayClassName="evevntOverlay"
        isOpen={isOpen}
        onRequestClose={onClose}
        style={{ content: { ...modalStyle } }}
      >
        <form onSubmit={(e) => { e.preventDefault(); submitNewEvent(); }} className="w-full px-3 flex justify-between items-center">
          <div className="relative flex items-center w-full">
            <LabelIcon style={{ color: color.code, marginRight: '8px' }} onClick={handleColorClick} />
            <Input
              type="text"
              placeholder="제목"
              ref={titleRef}
              color={color.code}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <IconButton style={{ color: color.code }} onClick={handleDetailOpen}>
              <MoreVertIcon />
            </IconButton>
            <ColorPicker visible={showColorPicker}>
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
          </div>
        </form>
      </Modal>
      <DetailModal
        open={detailOpen}
        onClose={handleDetailClose}
        color={color.code}
        setColor={(newColor) => setColor(colors.find(c => c.code === newColor) || initialColor)}
        title={title}
        setTitle={setTitle}
        selectedDay={selectedDay}
        onSave={handleSave}
        updateData={handleEventData}
        colors={colors}
      />
    </>
  );
});

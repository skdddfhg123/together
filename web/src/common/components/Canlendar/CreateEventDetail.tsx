// ModalComponent.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, formatISO, parseISO } from 'date-fns';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  MenuItem,
  FormGroup,
  Select,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PaletteIcon from '@mui/icons-material/Palette';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import * as REDIS from '@services/redisAPI';
import * as CALENDAR from '@services/calendarAPI';
import sendToast from '@hooks/useToast';

import { useMemberEventListState, useUserInfoStore } from '@store/index';

import default_user from '@assets/default_user.png';
import { Calendar, reqEvent } from '@type/index';

const selectStyles = css`
  &::before,
  &::after {
    border-bottom: none !important;
  }
  & .MuiSelect-icon {
    display: none;
  }
  & .MuiSelect-select {
    padding: 8px;
    background-color: transparent;
  }
`;

const menuItemStyles = css`
  display: flex;
  justify-content: center;
  color: #1e1e1e;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const StyledSelect = styled(Select)`
  ${selectStyles}
`;

const StyledMenuItem = styled(MenuItem)`
  ${menuItemStyles}
`;

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCalendar: Calendar | 'All';
  selectedDay: Date | null;
  color: string;
  colors: { code: string; name: string }[];
  title: string;
  setColor: (color: string) => void;
}

const formatDate = (date: Date | null): string => {
  return date ? format(date, 'yyyy-MM-dd') : '';
};

export default function DetailModal({
  isOpen,
  onClose,
  selectedDay,
  selectedCalendar,
  color,
  colors,
  title,
  setColor,
}: ModalComponentProps) {
  const { MemberEventList } = useMemberEventListState();
  const { userInfo } = useUserInfoStore();

  const titleRef = useRef<HTMLInputElement>(null);
  const [allDay, setAllDay] = useState(true);
  const [startDate, setStartDate] = useState<string>(formatDate(selectedDay));
  const [endDate, setEndDate] = useState<string>(formatDate(selectedDay));
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('23:30');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const resetForm = useCallback(() => {
    setAllDay(true);
    setStartDate(formatDate(selectedDay));
    setEndDate(formatDate(selectedDay));
    setStartTime('00:00');
    setEndTime('23:30');
    setSelectedMembers([]);
    if (titleRef.current) {
      titleRef.current.value = '';
    }
  }, [selectedDay]);

  const handleMemberChange = (email: string) => {
    setSelectedMembers((prev) =>
      prev.includes(email) ? prev.filter((member) => member !== email) : [...prev, email],
    );
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : i;
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const submitNewDetailEvent = useCallback(async () => {
    const title = titleRef.current?.value.trim();

    if (!title) return sendToast('default', '일정 제목이 비어있습니다.');
    if (!userInfo) return sendToast('default', '유저 정보를 찾을 수 없습니다. 새로고침해주세요.');
    if (selectedCalendar === 'All') {
      resetForm();
      onClose();
      return sendToast('default', '일정을 등록할 그룹 캘린더를 선택해주세요.');
    }

    const startAt = formatISO(parseISO(`${startDate}T${startTime}`), {
      representation: 'complete',
    });
    const endAt = formatISO(parseISO(`${endDate}T${endTime}`), { representation: 'complete' });

    const eventData: reqEvent = {
      groupCalendarId: selectedCalendar.calendarId,
      title: title,
      color: color,
      member: selectedMembers,
      startAt: startAt,
      endAt: endAt,
    };

    const res = await CALENDAR.createGroupSimpleEvent(eventData);
    if (res) {
      await CALENDAR.getGroupAllEvents(selectedCalendar);
      await REDIS.MessagePost({ selectedCalendar: selectedCalendar, method: `일정을 등록` });
    }
    resetForm();
    onClose();
  }, [resetForm, userInfo]);

  // Component initialization
  useEffect(() => {
    if (isOpen) {
      resetForm();
      MemberEventList.forEach((member) => {
        if (member.useremail === userInfo?.useremail) setSelectedMembers([member.useremail]);
      });
    }
  }, [isOpen, MemberEventList, resetForm, userInfo]);

  useEffect(() => {
    if (selectedDay) {
      const formattedDate = formatDate(selectedDay);
      setStartDate(formattedDate);
      setEndDate(formattedDate);
    }
  }, [selectedDay]);

  useEffect(() => {
    if (!allDay) {
      setStartTime('00:00');
      setEndTime('23:30');
    }
  }, [allDay]);

  useEffect(() => {
    MemberEventList.forEach((member) => {
      if (member.useremail === userInfo?.useremail) setSelectedMembers([member.useremail]);
    });
  }, [MemberEventList, userInfo?.useremail]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        className="flex justify-between items-center border-b"
        style={{ borderColor: color }}
      >
        <TextField
          placeholder="제목"
          defaultValue={title}
          inputRef={titleRef}
          fullWidth
          InputProps={{
            disableUnderline: true,
            style: { fontSize: '1.25rem', color: color },
          }}
          variant="standard"
        />
        <IconButton aria-label="close" onClick={onClose} className="p-1" style={{ color: color }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="space-y-4 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <AccessTimeIcon style={{ color: color }} />
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { borderBottom: 'none', color: '#1E1E1E' },
              }}
              fullWidth
              variant="standard"
            />
            {!allDay && (
              <FormControl variant="standard" fullWidth>
                <StyledSelect
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value as string)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={{ color: '#1E1E1E' }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {timeOptions.map((time) => (
                    <StyledMenuItem key={time} value={time}>
                      {time}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            )}
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { borderBottom: 'none', color: '#1E1E1E' },
              }}
              fullWidth
              variant="standard"
            />
            {!allDay && (
              <FormControl variant="standard" fullWidth>
                <StyledSelect
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value as string)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={{ color: '#1E1E1E' }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {timeOptions.map((time) => (
                    <StyledMenuItem key={time} value={time}>
                      {time}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            )}
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                style={{ color: color }}
              />
            }
            label="종일"
            className="ml-2"
            style={{ color: color }}
          />
          <div className="flex items-center space-x-4">
            <PeopleIcon style={{ color: color }} />
            <div className="overflow-auto max-h-50vh bg-transparent">
              <FormGroup>
                {MemberEventList.map((member) => (
                  <div key={member.useremail} className="flex items-center my-2">
                    <Checkbox
                      checked={selectedMembers.includes(member.useremail)}
                      onChange={() => handleMemberChange(member.useremail)}
                      style={{ color }}
                    />
                    <img
                      className="w-6 h-6 rounded-full mr-2"
                      src={member?.thumbnail ? member.thumbnail : default_user}
                      alt={member.nickname}
                    />
                    <span>{`${member.nickname} (${member.useremail})`}</span>
                  </div>
                ))}
              </FormGroup>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <PaletteIcon style={{ color: color }} />
            <FormControl fullWidth variant="standard">
              <StyledSelect
                value={color}
                onChange={(e) => setColor(e.target.value as string)}
                inputProps={{
                  style: { borderBottom: 'none', color: '#1E1E1E' },
                }}
                style={{ backgroundColor: 'transparent' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: 'white',
                      color: color,
                    },
                  },
                }}
              >
                {colors.map((colorOption) => (
                  <StyledMenuItem
                    key={colorOption.code}
                    value={colorOption.code}
                    style={{ color: colorOption.code }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '4px',
                          height: '20px',
                          backgroundColor: colorOption.code,
                          marginRight: '8px',
                        }}
                      ></div>
                      <span
                        style={{
                          color: colorOption.code,
                          filter: 'saturate(2.8) brightness(0.7) contrast(1.3)',
                        }}
                      >
                        {colorOption.name}
                      </span>
                    </div>
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="flex justify-between border-t p-4" style={{ borderColor: color }}>
        <Button onClick={onClose} className="mr-2" style={{ color: color }}>
          취소
        </Button>
        <Button
          onClick={submitNewDetailEvent}
          variant="contained"
          style={{ backgroundColor: color, color: 'white' }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

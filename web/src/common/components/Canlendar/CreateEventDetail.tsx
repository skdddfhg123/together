// ModalComponent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { format, parse, set } from 'date-fns';
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
import 'tailwindcss/tailwind.css';
import { useMemberEventListState, useUserInfoStore } from '@store/index';

import default_user from '@assets/default_user.png';

const selectStyles = css`
  &::before, &::after {
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
  color: #1E1E1E;
  &:hover {
    background-color: #E0E0E0;
  }
`;

const StyledSelect = styled(Select)`
  ${selectStyles}
`;

const StyledMenuItem = styled(MenuItem)`
  ${menuItemStyles}
`;

interface ModalComponentProps {
    open: boolean;
    onClose: () => void;
    color: string;
    setColor: (color: string) => void;
    title: string;
    setTitle: (title: string) => void;
    selectedDay: Date | null;
    onSave: () => void;
    updateData: (data: any) => void;
    colors: { code: string, name: string }[];
}

const DetailModal: React.FC<ModalComponentProps> = ({
    open,
    onClose,
    color,
    setColor,
    title,
    setTitle,
    selectedDay,
    onSave,
    updateData,
    colors
}) => {
    // const [title, setTitle] = useState<string>('');
    const [allDay, setAllDay] = useState(true);
    const { MemberEventList } = useMemberEventListState();
    const { userInfo } = useUserInfoStore();
    const [selectedMembers, setSelectedMembers] = useState<{ [key: string]: boolean }>({});

    const [startTime, setStartTime] = useState<string>('00:00');
    const [endTime, setEndTime] = useState<string>('23:30');

    const titleRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        // Filter to get only the emails of members who are selected
        const selectedEmails = Object.entries(selectedMembers)
            .filter(([email, isSelected]) => isSelected)
            .map(([email]) => email);

        // Call updateData to pass these selected emails back to the parent
        updateData({ selectedEmails });
        onClose();
        // console.log(`[DetailModal]\n${selectedEmails}`);
        // Additional logic or closing modal
        // onSave();
    };

    const formatDate = (date: Date | null): string => {
        return date ? format(date, 'yyyy-MM-dd') : '';
    };

    const [startDate, setStartDate] = useState<string>(formatDate(selectedDay));
    const [endDate, setEndDate] = useState<string>(formatDate(selectedDay));

    useEffect(() => {
        if (selectedDay) {
            const formattedDate = formatDate(selectedDay);
            setStartDate(formattedDate);
            setEndDate(formattedDate);
        }
    }, [selectedDay]);

    useEffect(() => {
        console.log(`[MemberEventList]\n${MemberEventList}`);
        if (titleRef.current) {
            titleRef.current.value = title;
        }
    }, [title]);

    useEffect(() => {
        if (!allDay) {
            setStartTime('00:00');
            setEndTime('23:30');
        }
    }, [allDay]);

    useEffect(() => {
        const initialSelections: { [key: string]: boolean } = {};
        MemberEventList.forEach(member => {
            initialSelections[member.useremail] = member.useremail === userInfo?.useremail; // 본인의 이메일일 경우 기본적으로 체크
        });
        setSelectedMembers(initialSelections);
    }, [MemberEventList, userInfo?.useremail]);

    const handleMemberChange = (email: string) => {
        console.log(email);
        setSelectedMembers(prev => ({
            ...prev,
            [email]: !prev[email]
        }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (titleRef.current) {
            setTitle(titleRef.current.value);
        }
    };

    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i < 10 ? `0${i}` : i;
        return [`${hour}:00`, `${hour}:30`];
    }).flat();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex justify-between items-center border-b" style={{ borderColor: color }}>
                <TextField
                    placeholder="제목"
                    defaultValue={title}
                    inputRef={titleRef}
                    onChange={handleTitleChange}
                    fullWidth
                    InputProps={{
                        disableUnderline: true,
                        style: { fontSize: '1.25rem', color: color },
                    }}
                    variant="standard"
                />
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className="p-1"
                    style={{ color: color }}
                >
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
                                                maxHeight: 200, // 드롭다운 메뉴의 최대 높이 설정
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
                                                maxHeight: 200, // 드롭다운 메뉴의 최대 높이 설정
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
                        control={<Checkbox checked={allDay} onChange={(e) => setAllDay(e.target.checked)} style={{ color: color }} />}
                        label="종일"
                        className="ml-2"
                        style={{ color: color }}
                    />
                    <div className="flex items-center space-x-4">
                        <PeopleIcon style={{ color: color }} />
                        <DialogContent style={{ overflow: 'auto', maxHeight: '50vh', backgroundColor: 'transparent' }}>
                            <FormGroup>
                                {MemberEventList.map((member) => (
                                    <div key={member.useremail} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                        <Checkbox
                                            checked={selectedMembers[member.useremail] || false}
                                            onChange={() => handleMemberChange(member.useremail)}
                                            style={{ color }}
                                        />
                                        <img
                                            className="w-6 h-6 rounded-full mr-2" // 썸네일 이미지 스타일 추가
                                            src={member?.thumbnail ? member.thumbnail : default_user} // 기본 이미지 설정
                                            alt={member.nickname}
                                        />
                                        <span>{`${member.nickname} (${member.useremail})`}</span>
                                    </div>
                                ))}
                            </FormGroup>
                        </DialogContent>
                    </div>
                    <div className="flex items-center space-x-4">
                        <PaletteIcon style={{ color: color }} />
                        <FormControl fullWidth variant="standard">
                            <StyledSelect
                                value={color}
                                onChange={(e) => setColor(e.target.value as string)}
                                inputProps={{
                                    disableUnderline: true,
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
                                    <StyledMenuItem key={colorOption.code} value={colorOption.code} style={{ color: colorOption.code }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '4px', height: '20px', backgroundColor: colorOption.code, marginRight: '8px' }}></div>
                                            <span style={{
                                                color: colorOption.code,
                                                filter: 'saturate(2.8) brightness(0.7) contrast(1.3)'
                                            }}>
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
                <Button onClick={onClose} color="primary" className="mr-2" style={{ color: color }}>
                    취소
                </Button>
                <Button onClick={() => { handleSave() }} color="primary" variant="contained" style={{ backgroundColor: color, color: 'white' }}>
                    저장
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailModal;

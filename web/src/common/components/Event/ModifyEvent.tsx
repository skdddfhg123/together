import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { format, parseISO } from 'date-fns';
import { UUID } from 'crypto';
import debounce from 'lodash.debounce';

import useToast from '@hooks/useToast';
import { GroupEvent, Member } from '@type/index';
import { useGroupEventInfoStore, useSelectedCalendarStore } from '@store/index';

import default_user from '@assets/default_user.png';

interface ModifyEventProps {
  eventId: UUID | null;
  setView: () => void;
  onClose: () => void;
  onSubmit: (formData: GroupEvent) => void;
}

const timeOptions = Array.from({ length: 24 }, (_, hour) => [
  `${hour.toString().padStart(2, '0')}:00`,
  `${hour.toString().padStart(2, '0')}:30`,
]).flat();

export default function ModifyEvent({ eventId, setView, onClose, onSubmit }: ModifyEventProps) {
  const { groupEventInfo, setIsLoaded } = useGroupEventInfoStore();
  const { selectedCalendar } = useSelectedCalendarStore();

  const [calendarMember, setCalendarMember] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [color, setColor] = useState<string>(groupEventInfo?.color || '#ffffff00');
  const [pinned, setPinned] = useState<boolean>(groupEventInfo?.pinned || false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [startAt, setStartAt] = useState<Date>(groupEventInfo?.startAt || new Date());
  const [endAt, setEndAt] = useState<Date>(groupEventInfo?.endAt || new Date());
  const [showStartOptions, setShowStartOptions] = useState(false);
  const [showEndOptions, setShowEndOptions] = useState(false);

  const debouncedSetColor = useCallback(
    debounce((newColor: string) => {
      setColor(newColor);
    }, 100),
    [setColor],
  );

  const handleColorChange = (newColor: string) => {
    debouncedSetColor(newColor);
  };

  const handleMemberClick = useCallback((member: Member) => {
    setSelectedMember((prev) =>
      prev.includes(member.useremail)
        ? prev.filter((email) => email !== member.useremail)
        : [...prev, member.useremail],
    );
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!eventId) return useToast('default', '변경할 일정을 찾지 못했습니다.');
      if (!titleRef.current?.value) return useToast('warning', '일정 제목을 입력해주세요.');

      const formData: GroupEvent = {
        groupEventId: eventId,
        title: titleRef.current.value,
        startAt: startAt,
        endAt: endAt,
        pinned: pinned,
        color: color,
        member: selectedMember,
        alerts: null,
      };

      onSubmit(formData);
      setIsLoaded(false);
      setView();
      onClose();
    },
    [
      eventId,
      titleRef,
      startAt,
      endAt,
      pinned,
      color,
      selectedMember,
      onSubmit,
      setIsLoaded,
      setView,
    ],
  );

  useEffect(() => {
    if (selectedCalendar && selectedCalendar !== 'All') {
      setCalendarMember(selectedCalendar.attendees);
    } else {
      setCalendarMember([]);
    }
  }, [selectedCalendar]);

  useEffect(() => {
    if (groupEventInfo && groupEventInfo.member) {
      setSelectedMember(groupEventInfo.member.map((email) => email));
    }
  }, [groupEventInfo]);

  useEffect(() => {
    return () => debouncedSetColor.cancel();
  }, [debouncedSetColor]);

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <nav className="FLEX-verB my-1 mx-2">
        <button type="submit" className="p-2 hover:bg-custom-light rounded">
          수정 완료
        </button>
        <button
          className="text-3xl rounded"
          type="button"
          onClick={() => {
            onClose();
            setView();
          }}
        >
          &times;
        </button>
      </nav>
      <header key="event-form">
        <h2 className="FLEX-horizC h-28 mb-6 mx-auto justify-end">
          <input
            type="text"
            ref={titleRef}
            className="w-80 p-3 rounded text-center"
            style={{ backgroundColor: color }}
            defaultValue={groupEventInfo?.title || 'no title'}
          />
        </h2>
      </header>
      <main>
        <section key="date-section" className="FLEX-ver p-1 space-x-2">
          <span className="FLEX-horizC w-full">
            <p className="font-semibold border-b w-full text-center">Start</p>
            <input
              className="appearance-none w-32"
              type="date"
              value={format(startAt, 'yyyy-MM-dd')}
              onChange={(e) => setStartAt(parseISO(e.target.value))}
            />
            <div className="relative">
              <button
                type="button"
                className="w-24 p-1 mt-1 border rounded"
                onClick={() => setShowStartOptions((prev) => !prev)}
              >
                {format(startAt, 'HH:mm')}
              </button>
              {showStartOptions && (
                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border mt-1">
                  {timeOptions.map((time) => (
                    <li
                      key={time}
                      className="p-2 hover:bg-gray-200"
                      onClick={() => {
                        setStartAt(parseISO(`${format(startAt, 'yyyy-MM-dd')}T${time}`));
                        setShowStartOptions(false);
                      }}
                    >
                      {time}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </span>
          <span className="FLEX-horizC w-full">
            <p className="font-semibold border-b w-full text-center">End</p>
            <input
              className="appearance-none w-32"
              type="date"
              value={format(endAt, 'yyyy-MM-dd')}
              onChange={(e) => setEndAt(parseISO(e.target.value))}
            />
            <div className="relative">
              <button
                type="button"
                className="w-24 p-1 mt-1 border rounded"
                onClick={() => setShowEndOptions((prev) => !prev)}
              >
                {format(endAt, 'HH:mm')}
              </button>
              {showEndOptions && (
                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border mt-1">
                  {timeOptions.map((time) => (
                    <li
                      key={time}
                      className="p-2 hover:bg-gray-200"
                      onClick={() => {
                        setEndAt(parseISO(`${format(endAt, 'yyyy-MM-dd')}T${time}`));
                        setShowEndOptions(false);
                      }}
                    >
                      {time}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </span>
        </section>
        <section key="member-section" className="FLEX-horizC my-6">
          <p className="mb-2 mx-auto w-10 border-b-2 text-center">멤버</p>
          <ul className="FLEX-verC space-x-2">
            {calendarMember.map((member: Member) => (
              <li key={member.useremail} className="FLEX-ver">
                <div onClick={() => handleMemberClick(member)}>
                  <img
                    className="max-h-14 max-w-14 mx-auto object-contain rounded-full"
                    src={member.thumbnail ? member.thumbnail : default_user}
                    alt={member.nickname}
                  />
                  <div>{member.nickname}</div>
                  <input
                    className="w-full items-center"
                    type="checkbox"
                    checked={selectedMember.some((email) => email === member.useremail)}
                    onChange={() => handleMemberClick(member)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <p className="m-4">
          {'중요: '}
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
        </p>
        <section key="color-section" className="FLEX-horizC m-8">
          <HexColorPicker
            style={{ width: '350px', height: '180px' }}
            color={color}
            onChange={handleColorChange}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="INPUT w-28 my-2 text-center"
            maxLength={8}
          />
        </section>
      </main>
    </form>
  );
}
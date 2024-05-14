import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { UUID } from 'crypto';
import debounce from 'lodash.debounce';

import { GroupEvent, Member } from '@type/index';
import { useGroupEventInfoStore, useSelectedCalendarStore } from '@store/index';

import default_user from '@assets/default_user.png';

interface ModifyEventProps {
  eventId: UUID | null;
  setView: () => void;
  onClose: () => void;
  onSubmit: (formData: GroupEvent) => void;
}

export default function ModifyEvent({ eventId, setView, onClose, onSubmit }: ModifyEventProps) {
  const { groupEventInfo, setIsLoaded } = useGroupEventInfoStore();
  const { selectedCalendar } = useSelectedCalendarStore();

  const [calendarMember, setCalendarMember] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [color, setColor] = useState<string>(groupEventInfo?.color || '#ffffff00');
  const [pinned, setPinned] = useState<boolean>(groupEventInfo?.pinned || false);
  const titleRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef<HTMLInputElement>(null);
  const endAtRef = useRef<HTMLInputElement>(null);

  // *********************? 함수

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

      if (!eventId) return alert('변경할 일정을 찾지 못했습니다.');
      const formData: GroupEvent = {
        groupEventId: eventId,
        title: titleRef.current?.value || groupEventInfo?.title || '제목',
        startAt: startAtRef.current?.value || groupEventInfo?.startAt || '시작 날짜',
        endAt: endAtRef.current?.value || groupEventInfo?.endAt || '종료 날짜',
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
      color,
      selectedMember,
      pinned,
      onClose,
      onSubmit,
      groupEventInfo,
      setView,
      setIsLoaded,
    ],
  );

  // *********************? 렌더링 함수

  useEffect(() => {
    return () => debouncedSetColor.cancel();
  }, [debouncedSetColor]);

  useEffect(() => {
    return () => {
      debouncedSetColor.cancel();
    };
  }, [debouncedSetColor]);

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <nav className="FLEX-verB my-1 mx-2">
        <button type="button" className="p-2 hover:bg-custom-light rounded" onClick={setView}>
          취소
        </button>
        <button type="submit" className="p-2 hover:bg-custom-light rounded">
          수정 완료
        </button>
      </nav>
      <header key="event-form">
        <h2 className="FLEX-horizC h-28 mb-6 mx-auto justify-end">
          <input
            type="text"
            ref={titleRef}
            className="w-80 p-3 rounded text-center"
            style={{ backgroundColor: color }}
            defaultValue={groupEventInfo?.title}
          />
        </h2>
      </header>
      <main>
        <section key="date-section" className="FLEX-verA h-20 items-center mx-auto mb-10">
          <span className="FLEX-horizC py-2 border-b">
            Start
            <input type="date" ref={startAtRef} defaultValue={groupEventInfo?.startAt} />
          </span>
          <span className="FLEX-horizC py-2 border-b ">
            End
            <input type="date" ref={endAtRef} defaultValue={groupEventInfo?.endAt} />
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

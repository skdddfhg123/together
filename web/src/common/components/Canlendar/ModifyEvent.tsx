import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { UUID } from 'crypto';
import debounce from 'lodash.debounce';

import { GroupEvent, Member } from '@type/index';
import { useGroupEventInfoStore, useSelectedCalendarStore } from '@store/index';

interface ModifyEventProps {
  eventId: UUID | null;
  setView: () => void;
  onClose: () => void;
  onSubmit: (formData: GroupEvent) => void;
}

export default function ModifyEvent({ eventId, setView, onClose, onSubmit }: ModifyEventProps) {
  const { groupEventInfo, setIsLoaded } = useGroupEventInfoStore();
  const { selectedCalendar } = useSelectedCalendarStore();

  const [calendarMembers, setCalendarMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [color, setColor] = useState<string>(groupEventInfo?.color || '#ffffff00');
  const [pinned, setPinned] = useState<boolean>(groupEventInfo?.pinned || false);
  const titleRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef<HTMLInputElement>(null);
  const endAtRef = useRef<HTMLInputElement>(null);

  // *********************? 함수

  useEffect(() => {
    if (selectedCalendar && selectedCalendar !== 'All') {
      setCalendarMembers(selectedCalendar.attendees);
    } else {
      setCalendarMembers([]);
    }
  }, [selectedCalendar]);

  const debouncedSetColor = useCallback(
    debounce((newColor: string) => {
      setColor(newColor);
    }, 100),
    [],
  );

  const handleColorChange = (newColor: string) => {
    debouncedSetColor(newColor);
  };

  const handleMemberClick = useCallback((member: Member) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.useremail === member.useremail)
        ? prev.filter((m) => m.useremail !== member.useremail)
        : [...prev, member],
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
        members: selectedMembers,
      };
      onSubmit(formData);
      setView();
      setIsLoaded(false);
      onClose();
    },
    [eventId, color, selectedMembers, pinned, onClose, onSubmit, groupEventInfo, setView],
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
    <form onSubmit={handleSubmit}>
      <nav className="FLEX-verB mx-4 mt-4 mb-16">
        <button type="button" className="p-2 hover:bg-custom-light rounded" onClick={setView}>
          취소
        </button>
        <button type="submit" className="p-2 hover:bg-custom-light rounded">
          수정 완료
        </button>
      </nav>
      <header key="event-form">
        <h2 className="FLEX-horizC h-28 mb-12 mx-auto justify-end">
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
        <section key="date-section" className="FLEX-verA h-20 items-center mx-auto mb-12">
          <span className="FLEX-horizC py-2 border-b">
            Start
            <input type="date" ref={startAtRef} defaultValue={groupEventInfo?.startAt} />
          </span>
          <span className="FLEX-horizC py-2 border-b ">
            End
            <input type="date" ref={endAtRef} defaultValue={groupEventInfo?.endAt} />
          </span>
        </section>
        <section key="member-section" className="m-4">
          {'멤버: '}
          <ul>
            {calendarMembers.map((member: Member) => (
              <li
                key={member.useremail}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <div onClick={() => handleMemberClick(member)}>
                  <img
                    src={member.thumbnail ? member.thumbnail : 'default-thumbnail.jpg'}
                    alt={member.nickname}
                    style={{ marginRight: '10px', width: '50px', height: '50px' }}
                  />
                  <div>{member.nickname}</div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedMembers.some((m) => m.useremail === member.useremail)}
                  onChange={() => handleMemberClick(member)}
                  style={{ marginLeft: 'auto' }}
                />
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

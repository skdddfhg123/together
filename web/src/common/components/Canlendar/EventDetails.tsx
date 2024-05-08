import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UUID } from 'crypto';
import { HexColorPicker } from 'react-colorful';
import { format, parseISO } from 'date-fns';
import debounce from 'lodash.debounce';

import * as USER from '@services/userAPI';
import * as CALENDAR from '@services/calendarAPI';

import { useGroupEventListStore, useSelectedCalendarStore } from '@store/index';
import { GroupEvent } from '@type/index';
import CreateFeed from '@components/Feed/CreateFeed';

interface EventDetailsProps {
  isOpen: boolean;
  eventId: UUID | null;
  onClose: () => void;
}

export default React.memo(function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState<GroupEvent>({
    title: '',
    startAt: '',
    endAt: '',
    member: [],
    color: '',
    pinned: false,
    alerts: null,
    emails: null,
  });

  // **************? 렌더링 시 보여줄 데이터 설정 및 최초 render useEffect
  const groupEvent = useMemo(() => {
    return useGroupEventListStore
      .getState()
      .groupEvents.find((event) => event.groupEventId === eventId);
  }, [eventId]);

  useEffect(() => {
    if (groupEvent && JSON.stringify(groupEvent) !== JSON.stringify(editedValues)) {
      setEditedValues({
        title: groupEvent.title,
        startAt: groupEvent.startAt,
        endAt: groupEvent.endAt,
        author: groupEvent.author,
        member: groupEvent.member,
        color: groupEvent.color,
        pinned: groupEvent.pinned,
        groupEventId: groupEvent.groupEventId,
        emails: groupEvent.emails,
        alerts: groupEvent.alerts,
      });
    }
  }, [groupEvent]);

  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
    }
  }, [isOpen]);

  const displayDate = (dateString?: string) => {
    if (!dateString) return { year: '', monthDay: '' };

    const date = parseISO(dateString);
    const year = format(date, 'yyyy');
    const monthDay = format(date, 'MM-dd');
    return { year, monthDay };
  };

  const setDebouncedEditedValues = useCallback(
    debounce((newValues: Partial<GroupEvent>) => {
      setEditedValues((prev) => ({ ...prev, ...newValues }));
    }, 300),
    [],
  );

  // **************?  handle Function
  const handleChange = useCallback(
    (field: keyof GroupEvent, value: UUID | string | string[] | boolean) => {
      setDebouncedEditedValues({ [field]: value });
    },
    [setDebouncedEditedValues],
  );

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    if (groupEvent) {
      setEditedValues({
        title: groupEvent.title,
        author: groupEvent.author,
        startAt: groupEvent.startAt,
        endAt: groupEvent.endAt,
        member: groupEvent.member,
        color: groupEvent.color,
        pinned: groupEvent.pinned,
        groupEventId: groupEvent.groupEventId,
        emails: groupEvent.emails,
        alerts: groupEvent.alerts,
      });
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return onClose();

    const res = await CALENDAR.removeGroupEvent(eventId);
    if (res && useSelectedCalendarStore.getState().SelectedCalendar === 'All')
      await USER.firstRender();

    onClose();
  };

  const handleSave = async () => {
    const res = await CALENDAR.updateGroupEvent(editedValues);
    if (res && useSelectedCalendarStore.getState().SelectedCalendar === 'All')
      await USER.firstRender();

    onClose();
  };

  if (!editMode) {
    return (
      <div
        id={`${isOpen ? 'SLIDEdetailIn-right' : 'SLIDEdetailOut-right'}`}
        className={`h-full SCROLL-hide ${isOpen ? 'event-detail' : ''}`}
      >
        {isOpen && (
          <>
            <nav className="m-4 FLEX-verB">
              <button className="p-2 hover:bg-custom-light rounded" onClick={onClose}>
                닫기
              </button>
              <div>
                <button className="p-2 mr-3 hover:bg-custom-light rounded" onClick={handleDelete}>
                  삭제
                </button>
                <button className="p-2 hover:bg-custom-light rounded" onClick={handleEdit}>
                  수정
                </button>
              </div>
            </nav>
            <form key="event-form">
              <div className="m-4">작성자 : {groupEvent?.author}</div>
              <h2
                className="w-80 p-3 my-8 mx-auto text-3xl text-center rounded"
                style={{ backgroundColor: `${editedValues.color}` }}
              >
                {groupEvent?.title}
              </h2>
              <section key="date-section" className="FLEX-verA my-8 mx-2">
                <div className="FLEX-horizC">
                  <div>{displayDate(groupEvent?.startAt).year}</div>
                  <h2>{displayDate(groupEvent?.startAt).monthDay}</h2>
                </div>
                <h1 className="text-custom-main">{'>'}</h1>
                <div className="FLEX-horizC">
                  <div>{displayDate(groupEvent?.endAt).year}</div>
                  <h2>{displayDate(groupEvent?.endAt).monthDay}</h2>
                </div>
              </section>
              <div className="m-4">
                {'멤버 : '}
                {groupEvent?.member && groupEvent.member.length > 0
                  ? groupEvent.member.map((mem, idx) => <div key={idx}>{mem}</div>)
                  : '없음'}
              </div>
              <div className="m-4">
                {'중요 : '}
                {groupEvent?.pinned ? 'Yes' : 'No'}
              </div>
            </form>
            <CreateFeed />
          </>
        )}
      </div>
    );
  } else {
    return (
      <div
        id={`${isOpen ? 'SLIDEdetailIn-right' : 'SLIDEdetailOut-right'}`}
        className={`h-full SCROLL-hide ${isOpen ? 'event-detail' : ''}`}
      >
        {isOpen && (
          <div>
            <nav className="FLEX-verB m-4 ">
              <button className="p-2 hover:bg-custom-light rounded" onClick={handleCancel}>
                취소
              </button>

              <div>
                <button className="p-2 hover:bg-custom-light rounded" onClick={handleSave}>
                  수정 완료
                </button>
              </div>
            </nav>
            <form key="event-form">
              <h2 className="my-8 mx-auto text-center">
                <input
                  type="text"
                  className="p-3 w-80 rounded text-center"
                  style={{ backgroundColor: `${editedValues.color}` }}
                  value={editedValues.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </h2>
              <section key="date-section" className="FLEX-verA my-8 mx-auto">
                <div className="FLEX-horiz text-center">
                  <label className="py-2 border-b">Start</label>
                  <input
                    type="date"
                    // value={editedValues.startAt}
                    onChange={(e) => handleChange('startAt', e.target.value)}
                  />
                </div>
                <div className="FLEX-horiz text-center">
                  <label className="py-2 border-b">End</label>
                  <input
                    type="date"
                    // value={editedValues.endAt}
                    onChange={(e) => handleChange('endAt', e.target.value)}
                  />
                </div>
              </section>
              <section key="member-section" className="m-4">
                {'멤버 : '}
                <input
                  type="text"
                  value={editedValues.member.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'member',
                      e.target.value.split(',').map((item) => item.trim()),
                    )
                  }
                />
              </section>
              <div className="m-4">
                {'중요 : '}
                <input
                  type="checkbox"
                  checked={editedValues.pinned}
                  onChange={(e) => handleChange('pinned', e.target.checked)}
                />
              </div>
              <div className="FLEX-horizC m-8">
                <HexColorPicker
                  color={editedValues.color || '#ffffff00'}
                  onChange={(color) => handleChange('color', color)}
                  defaultValue={`${editedValues.color}`}
                />
                <input
                  className="INPUT w-28 my-2 text-center"
                  type="text"
                  maxLength={8}
                  defaultValue={`${editedValues.color || ''}`}
                  onChange={(e) => handleChange('color', e.target.value)}
                ></input>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
});

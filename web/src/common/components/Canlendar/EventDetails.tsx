import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { format, parseISO } from 'date-fns';
import debounce from 'lodash.debounce';

import * as CALENDAR from '@services/calendarAPI';
import * as USER from '@services/userAPI';
import { useGroupEventStore, resGroupEventStore, useNowCalendarStore } from '@store/index';

interface EventDetailsProps {
  isOpen: boolean;
  eventId: string | null;
  onClose: () => void;
}

export default React.memo(function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState<resGroupEventStore>({
    title: '',
    startAt: '',
    endAt: '',
    author: '',
    member: [],
    color: '',
    pinned: false,
    groupEventId: '',
    alerts: null,
    emails: null,
  });
  const groupEvents = useGroupEventStore((state) => state.groupEvents);
  const groupEvent = useMemo(() => {
    return groupEvents.find((event) => event.groupEventId === eventId);
  }, [eventId, groupEvents]);
  const { nowCalendar } = useNowCalendarStore();
  // *************TODO 전체 캘린더에서 일정을 삭제하면 현재 리렌더링이 발생하지 않고있어서 문제 해결 필요

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

  // **************? 렌더링 시 isOpen 값에 의해 Edit창 비활성화
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
    debounce((newValues: Partial<resGroupEventStore>) => {
      setEditedValues((prev) => ({ ...prev, ...newValues }));
    }, 300),
    [],
  );

  const handleChange = useCallback(
    (field: keyof resGroupEventStore, value: string | string[] | boolean) => {
      setDebouncedEditedValues({ [field]: value });
    },
    [setDebouncedEditedValues],
  );

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return onClose();
    const res = await CALENDAR.deleteGroupEvent(editedValues.groupEventId);
    if (res && nowCalendar === 'All') await USER.firstRender();
    onClose();
  };

  const handleSave = async () => {
    const res = await CALENDAR.updateGroupEvent(editedValues);
    if (res && nowCalendar === 'All') await USER.firstRender();
    onClose();
  };

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

  return (
    <div
      id={`${isOpen ? 'slideDetailIn-right' : 'slideDetailOut-right'}`}
      className={`${isOpen ? 'event-detail' : ''} h-full overflow-hidden`}
    >
      {isOpen && (
        <div>
          <nav className="m-4 flex justify-between">
            {editMode ? (
              <button className="p-2 hover:bg-custom-light rounded" onClick={handleCancel}>
                취소
              </button>
            ) : (
              <button className="p-2 hover:bg-custom-light rounded" onClick={onClose}>
                닫기
              </button>
            )}
            <div>
              {editMode ? (
                <></>
              ) : (
                <button className="p-2 mr-3 hover:bg-custom-light rounded" onClick={handleDelete}>
                  삭제
                </button>
              )}
              <button
                className="p-2 hover:bg-custom-light rounded"
                onClick={editMode ? handleSave : handleEdit}
              >
                {editMode ? '수정 완료' : '수정'}
              </button>
            </div>
          </nav>
          <form key="event-form">
            <h2 className="text-center my-8 mx-2" style={{ color: `${editedValues.color}` }}>
              {editMode ? (
                <input
                  type="text"
                  className="custom-input w-72 text-center"
                  value={editedValues.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              ) : (
                groupEvent?.title
              )}
            </h2>
            <section id="date-section" className="my-8 mx-2 flex justify-around text-center">
              <div className="flex flex-col">
                {editMode ? (
                  <input
                    type="date"
                    value={editedValues.startAt}
                    onChange={(e) => handleChange('startAt', e.target.value)}
                    defaultValue={editedValues.startAt}
                  />
                ) : (
                  <>
                    <div>{displayDate(groupEvent?.startAt).year}</div>
                    <h2>{displayDate(groupEvent?.startAt).monthDay}</h2>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                {editMode ? (
                  <input
                    type="date"
                    value={editedValues.endAt}
                    onChange={(e) => handleChange('endAt', e.target.value)}
                    defaultValue={editedValues.endAt}
                  />
                ) : (
                  <>
                    <div>{displayDate(groupEvent?.endAt).year}</div>
                    <h2>{displayDate(groupEvent?.endAt).monthDay}</h2>
                  </>
                )}
              </div>
            </section>
            <div className="m-4">
              {editMode ? <></> : <div>작성자 : {groupEvent?.author}</div>}
              멤버 :
              {editMode ? (
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
              ) : groupEvent?.member && groupEvent.member.length > 0 ? (
                groupEvent.member.map((mem, idx) => <div key={idx}>{mem}</div>)
              ) : (
                '없음'
              )}
            </div>
            <div className="m-4">
              {'중요 : '}
              {editMode ? (
                <input
                  type="checkbox"
                  checked={editedValues.pinned}
                  onChange={(e) => handleChange('pinned', e.target.checked)}
                />
              ) : groupEvent?.pinned ? (
                'Yes'
              ) : (
                'No'
              )}
            </div>
            <div className="flex flex-col items-center justify-center m-8">
              {editMode && (
                <>
                  <HexColorPicker
                    color={editedValues.color || '#ffffff00'}
                    onChange={(color) => handleChange('color', color)}
                    defaultValue={`${editedValues.color}`}
                  />
                  <input
                    className="custom-input w-28 my-2 text-center"
                    type="text"
                    maxLength={8}
                    defaultValue={`${editedValues.color || ''}`}
                    onChange={(e) => handleChange('color', e.target.value)}
                  ></input>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
});

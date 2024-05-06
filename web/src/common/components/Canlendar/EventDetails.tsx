import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { HexColorPicker } from 'react-colorful';

import { useGroupEventStore, resGroupEventStore } from '@store/index';

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

  useMemo(() => {
    if (groupEvent) {
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

  const handleChange = (field: keyof resGroupEventStore, value: string | string[] | boolean) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);
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
    // ****************TODO 구겨지면서 열리는거 마음에 안듦
    <div
      className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-128' : 'w-0'}`}
    >
      {isOpen && (
        <div>
          <nav className="flex m-4 justify-between">
            {editMode ? (
              <button className="p-2" onClick={handleCancel}>
                Cancel
              </button>
            ) : (
              <button className="p-2" onClick={onClose}>
                Close
              </button>
            )}
            <button className="p-2" onClick={editMode ? handleSave : handleEdit}>
              {editMode ? 'Save' : 'Edit'}
            </button>
          </nav>
          <form key="event-form" id={`${isOpen ? 'slideIn-right' : 'slideOut-right'}`}>
            <h2 className="text-center my-8 mx-2">
              {editMode ? (
                <input
                  type="text"
                  className="customInput w-72 text-center"
                  value={editedValues.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              ) : (
                groupEvent?.title
              )}
            </h2>
            <section
              id="date-section"
              className="my-8 mx-2 flex flex-row justify-around text-center"
            >
              <div className="flex flex-col">
                {editMode ? (
                  <input
                    type="date"
                    value={editedValues.startAt}
                    onChange={(e) => handleChange('startAt', e.target.value)}
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
                  />
                ) : (
                  <>
                    <div>{displayDate(groupEvent?.endAt).year}</div>
                    <h2>{displayDate(groupEvent?.endAt).monthDay}</h2>
                  </>
                )}
              </div>
            </section>
            <div className="m-2">
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
            <div className="m-2">
              {'Color : '}
              {editMode ? (
                <HexColorPicker
                  color={editedValues.color || '#ffffff00'}
                  onChange={(color) => handleChange('color', color)}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: editedValues.color || '#ffffff00',
                    color: '#fff',
                    padding: '0.5rem',
                  }}
                >
                  {editedValues.color}
                </div>
              )}
            </div>
            <div className="m-2">
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
          </form>
        </div>
      )}
    </div>
  );
});

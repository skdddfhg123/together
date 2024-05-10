import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UUID } from 'crypto';
import { HexColorPicker } from 'react-colorful';
import { format, parseISO } from 'date-fns';
import debounce from 'lodash.debounce';

import * as USER from '@services/userAPI';
import * as CALENDAR from '@services/calendarAPI';
import * as FEED from '@services/eventFeedAPI';

import { useGroupEventListStore, useSelectedCalendarStore } from '@store/index';
import { GroupEvent } from '@type/index';
import CreateFeedModal from '@components/Feed/CreateFeed/CreateFeedModal';
import EventFeedList from '@components/Canlendar/EventFeedList';

interface EventDetailsProps {
  isOpen: boolean;
  eventId: UUID | null;
  onClose: () => void;
}

export default React.memo(function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
  const { SelectedCalendar } = useSelectedCalendarStore();
  const { groupEvents } = useGroupEventListStore();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [feedCreate, setFeedCreate] = useState<boolean>(false);
  const [editedValues, setEditedValues] = useState<GroupEvent>({
    title: '',
    startAt: '',
    endAt: '',
    member: null,
    color: '',
    pinned: false,
    alerts: null,
    emails: null,
  });

  // **************? 렌더링 시 보여줄 데이터 설정 및 최초 render useEffect

  // TODO 전체 일정 보기 상태일 땐, 각 일정들을 그룹별로 설정된 디폴트 색을 보여줘야할 듯. + 수정도 막아야할듯 ?
  // TODO 그룹 안에서만 일정 수정 가능하게 SeletedCalendar가 "All" 일땐 수정 버튼 막아야할듯 ?
  // TODO 지금 컬러 바꾸기 디바운싱 때문에 제목도 느리게 입력됨

  const groupEvent: GroupEvent | undefined = useMemo(() => {
    return groupEvents.find((event) => event.groupEventId === eventId);
  }, [eventId]);

  const displayDate = (dateString?: string) => {
    if (!dateString) return { year: '', monthDay: '' };

    const date = parseISO(dateString);
    const year = format(date, 'yyyy');
    const monthDay = format(date, 'MM-dd');
    return { year, monthDay };
  };

  // **************?  handle Function
  const closeFeedCreateModal = useCallback(() => setFeedCreate(false), []);
  const handleEditMode = useCallback(() => setEditMode(true), []);

  const getEventFeedList = async (groupEventId: UUID) => {
    await FEED.getAllFeedInEvent(groupEventId);
  };

  const setDebouncedEditedValues = useCallback(
    debounce((newValues: Partial<GroupEvent>) => {
      setEditedValues((prev) => ({ ...prev, ...newValues }));
    }, 300),
    [],
  );

  const handleChange = useCallback(
    (field: keyof GroupEvent, value: UUID | string | string[] | boolean) => {
      setDebouncedEditedValues({ [field]: value }); // Color값 디바운싱
    },
    [setDebouncedEditedValues],
  );

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
    if (res && SelectedCalendar === 'All') await USER.firstRender();
    await CALENDAR.getGroupAllEvents(SelectedCalendar);

    onClose();
  };

  const handleSave = async () => {
    const res = await CALENDAR.updateGroupEvent(editedValues);
    if (res && SelectedCalendar === 'All') return await USER.firstRender();
    await CALENDAR.getGroupAllEvents(SelectedCalendar);

    onClose();
  };

  // *****************? 최초 렌더링, action에 따른 동작 handling

  useEffect(() => {
    if (eventId) {
      getEventFeedList(eventId);
    }
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
  }, [eventId]);

  useEffect(() => {
    if (!isOpen) setEditMode(false);
  }, [isOpen]);

  useEffect(() => onClose(), [SelectedCalendar, groupEvents]);

  if (!editMode) {
    return (
      <div
        id={`${isOpen ? 'SLIDEdetailIn-right' : 'SLIDEdetailOut-right'}`}
        className={`h-full SCROLL-hide ${isOpen ? 'event-detail' : ''}`}
      >
        {isOpen && (
          <>
            <nav className="FLEX-verB h-fit mx-2 my-2">
              <button className="p-2 hover:bg-custom-light rounded" onClick={onClose}>
                닫기
              </button>
              <div>
                <button className="p-2 mr-1 hover:bg-custom-light rounded" onClick={handleDelete}>
                  삭제
                </button>
                <button className="p-2 mr-1 hover:bg-custom-light rounded" onClick={handleEditMode}>
                  수정
                </button>
                <button
                  className="BTN hover:bg-custom-light rounded"
                  onClick={() => setFeedCreate(!feedCreate)}
                >
                  피드 등록
                  <CreateFeedModal
                    groupEventId={groupEvent?.groupEventId || null}
                    isOpen={feedCreate}
                    onClose={closeFeedCreateModal}
                  />
                </button>
              </div>
            </nav>
            <header className="FLEX-horizC h-auto p-4 justify-end">
              {SelectedCalendar !== 'All' && groupEvent?.author ? (
                <span className="mb-6">
                  {groupEvent?.author.userProfile ? (
                    <img width="300px" src={`${groupEvent?.author.userProfile}`}></img>
                  ) : (
                    <>{groupEvent?.author.nickname}</>
                  )}
                </span>
              ) : null}
              <h2
                className="w-80 p-3 mx-auto text-3xl text-center rounded"
                style={{ backgroundColor: `${editedValues.color}` }}
              >
                {groupEvent?.title}
              </h2>
            </header>
            <main>
              <section key="date-section" className="FLEX-verA items-center p-4">
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
              <section key="detail-section" className="FLEX-verC p-2">
                <span className="m-4">
                  {'멤버 : '}
                  {groupEvent?.member && groupEvent.member.length > 0
                    ? groupEvent.member.map((mem) => (
                        <span key={mem.useremail}>{`${mem.nickname}`}</span>
                      ))
                    : '없음'}
                </span>
                <span className="m-4">
                  {'중요 : '}
                  {groupEvent?.pinned ? 'Yes' : 'No'}
                </span>
              </section>
            </main>
            <EventFeedList />
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
            <nav className="FLEX-verB mx-4 mt-4 mb-16">
              <button className="p-2 hover:bg-custom-light rounded" onClick={handleCancel}>
                취소
              </button>

              <div>
                <button className="p-2 hover:bg-custom-light rounded" onClick={handleSave}>
                  수정 완료
                </button>
              </div>
            </nav>
            <header key="event-form">
              <h2 className="FLEX-horizC h-28 mb-12 mx-auto justify-end">
                <input
                  type="text"
                  className="w-80 p-3 rounded text-center"
                  style={{ backgroundColor: `${editedValues.color}` }}
                  value={editedValues.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </h2>
            </header>
            <main>
              <section key="date-section" className="FLEX-verA h-20 items-center mx-auto mb-12">
                <p className="FLEX-horiz py-2 border-b text-center">
                  Start
                  <input
                    type="date"
                    // value={editedValues.startAt}
                    onChange={(e) => handleChange('startAt', e.target.value)}
                  />
                </p>
                <p className="FLEX-horiz py-2 border-b text-center">
                  End
                  <input
                    type="date"
                    // value={editedValues.endAt}
                    onChange={(e) => handleChange('endAt', e.target.value)}
                  />
                </p>
              </section>
              <section key="member-section" className="m-4">
                {/* {'멤버 : '}
                <input
                  type="text"
                  value="미구현"
                  onChange={(e) => }   // TODO : 멤버 객체들 중에 선택해서 고를 수 있게 변경 */}
                {/* /> */}
              </section>
              <p className="m-4">
                {'중요 : '}
                <input
                  type="checkbox"
                  checked={editedValues.pinned}
                  onChange={(e) => handleChange('pinned', e.target.checked)}
                />
              </p>
              <section key="color-section" className="FLEX-horizC m-8">
                <HexColorPicker
                  style={{ width: '350px', height: '180px' }}
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
              </section>
            </main>
          </div>
        )}
      </div>
    );
  }
});

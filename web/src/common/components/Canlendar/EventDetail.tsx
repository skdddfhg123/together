// import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { UUID } from 'crypto';
// import { HexColorPicker } from 'react-colorful';
// import { format, parseISO } from 'date-fns';
// import debounce from 'lodash.debounce';

// import * as USER from '@services/userAPI';
// import * as CALENDAR from '@services/calendarAPI';
// import * as FEED from '@services/eventFeedAPI';

// import {
//   useCalendarListStore,
//   useGroupEventListStore,
//   useSelectedCalendarStore,
// } from '@store/index';
// import { GroupEvent } from '@type/index';
// import CreateFeedModal from '@components/Feed/CreateFeed/CreateFeedModal';
// import EventFeedList from '@components/Canlendar/EventFeedList';

// interface EventDetailsProps {
//   isOpen: boolean;
//   eventId: UUID | null;
//   onClose: () => void;
// }

// export default React.memo(function EventDetails({ isOpen, eventId, onClose }: EventDetailsProps) {
//   const { SelectedCalendar } = useSelectedCalendarStore();
//   const { groupEvents } = useGroupEventListStore();
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [feedCreate, setFeedCreate] = useState<boolean>(false);
//   const [editedValues, setEditedValues] = useState<GroupEvent | null>(null);
//   const titleRef = useRef<HTMLInputElement>(null);
//   const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

//   const CalendarList = useCalendarListStore.getState().calendars;
//   const CalendarMember = CalendarList.find(
//     (calendar) => calendar.calendarId === SelectedCalendar,
//   )?.attendees;

//   const handleMemberClick = (member: string) => {
//     if (selectedMembers.includes(member)) {
//       setSelectedMembers(selectedMembers.filter((m) => m !== member));
//     } else {
//       setSelectedMembers([...selectedMembers, member]);
//     }
//   };

//   console.log(`내 그룹 캘린더 멤버 보기`, CalendarMember);

//   // TODO 전체 일정 보기 상태일 땐, 각 일정들을 그룹별로 설정된 디폴트 색을 보여줘야할 듯. + 수정도 막아야할듯 ?
//   // TODO 그룹 안에서만 일정 수정 가능하게 SeletedCalendar가 "All" 일땐 수정 버튼 막아야할듯 ?

//   const groupEvent: GroupEvent | undefined = useMemo(() => {
//     return groupEvents.find((event) => event.groupEventId === eventId);
//   }, [eventId]);

//   const displayDate = (dateString?: string) => {
//     if (!dateString) return { year: '', monthDay: '' };

//     const date = parseISO(dateString);
//     const year = format(date, 'yyyy');
//     const monthDay = format(date, 'MM-dd');
//     return { year, monthDay };
//   };

//   // **************?  handle Function
//   const closeFeedCreateModal = useCallback(() => setFeedCreate(false), []);
//   const handleEditMode = useCallback(() => setEditMode(true), []);

//   const getEventFeedList = async (groupEventId: UUID) => {
//     await FEED.getAllFeedInEvent(groupEventId);
//   };

//   const handleCancel = () => {
//     if (groupEvent) {
//       setEditedValues(groupEvent);
//     }
//     setEditMode(false);
//   };

//   const deleteEvent = async () => {
//     if (!window.confirm('정말 삭제하시겠습니까?')) return onClose();

//     const res = await CALENDAR.removeGroupEvent(eventId);
//     if (res && SelectedCalendar === 'All') await USER.firstRender();
//     await CALENDAR.getGroupAllEvents(SelectedCalendar);

//     onClose();
//   };

//   // **************? action에 따른 동작 handling
//   const submitUpdateEvent = async () => {
//     if (!titleRef.current) {
//       alert('일정명을 입력해주세요.');
//       return;
//     }
//     if (!editedValues) return;
//     const updatedValues: GroupEvent = {
//       ...editedValues,
//       title: titleRef.current.value,
//     };

//     const res = await CALENDAR.updateGroupEvent(updatedValues);
//     setEditedValues(res);
//     if (res && SelectedCalendar === 'All') return await USER.firstRender();
//     await CALENDAR.getGroupAllEvents(SelectedCalendar);
//     onClose();
//   };

//   const debouncedSetColor = useCallback(
//     debounce((color: string) => {
//       setEditedValues((prev) => {
//         if (prev === null) {
//           return {
//             groupCalendarId: groupEvent?.groupCalendarId,
//             groupCalendarTitle: groupEvent?.groupCalendarTitle,
//             title: '',
//             author: groupEvent?.author,
//             startAt: '',
//             endAt: '',
//             member: groupEvent?.member,
//             color: color,
//             pinned: false,
//             emails: null,
//           };
//         } else {
//           return { ...prev, color };
//         }
//       });
//     }, 300),
//     [],
//   );

//   const updateEventValue = useCallback(
//     (field: keyof GroupEvent, value: UUID | string | string[] | boolean) => {
//       if (field === 'color') {
//         debouncedSetColor(value as string);
//       } else {
//         setEditedValues((prev) => {
//           if (!prev) return null;
//           const newTitle = titleRef.current ? titleRef.current.value : prev.title;
//           return {
//             ...prev,
//             [field]: value,
//             title: newTitle,
//           };
//         });
//       }
//     },
//     [debouncedSetColor],
//   );

//   // *****************? 최초 렌더링

//   /*
//   TODO 캘린더 id가 all일때 캘린더 제목 보이도록 수정해야함 -> 아래 useEffect가 문제인듯
//   TODO why? 최초 렌더링 시 -> 그룹 선택 시까진 잘 보이는데 다시 all로 가면 그룹 타이틀로 바뀌지 않음
//   */
//   useEffect(() => {
//     console.log(`캘린더`, SelectedCalendar);
//     if (eventId) {
//       getEventFeedList(eventId);
//     }
//     if (SelectedCalendar && groupEvent) {
//       setEditedValues(groupEvent);
//       console.log(`세팅된 그룹 이벤트`, groupEvent);
//     }
//   }, [eventId, SelectedCalendar]);

//   useEffect(() => {
//     if (!isOpen) setEditMode(false);
//   }, [isOpen, SelectedCalendar]);

//   useEffect(() => onClose(), [SelectedCalendar, groupEvents]);

//   if (!eventId && !isOpen) return null;
//   if (!editMode) {
//     return (
//       <div
//         id={`${isOpen ? 'SLIDEdetailIn-right' : 'SLIDEdetailOut-right'}`}
//         className={`h-full SCROLL-hide ${isOpen ? 'event-detail' : ''}`}
//       >
//         {isOpen && (
//           <>
//             <nav className="FLEX-verB h-fit mx-2 my-1">
//               <button className="p-2 hover:bg-custom-light rounded" onClick={onClose}>
//                 닫기
//               </button>
//               <div className="space-x-1">
//                 <button className="p-2  hover:bg-custom-light rounded" onClick={deleteEvent}>
//                   삭제
//                 </button>
//                 <button className="p-2 hover:bg-custom-light rounded" onClick={handleEditMode}>
//                   수정
//                 </button>
//                 <button
//                   className="BTN hover:bg-custom-light rounded"
//                   onClick={() => setFeedCreate(!feedCreate)}
//                 >
//                   피드 등록
//                   <CreateFeedModal
//                     groupEventId={groupEvent?.groupEventId || null}
//                     isOpen={feedCreate}
//                     onClose={closeFeedCreateModal}
//                   />
//                 </button>
//               </div>
//             </nav>
//             <header className="FLEX-horizC h-auto p-4 justify-end">
//               {SelectedCalendar === 'All' ? groupEvent?.groupCalendarTitle : <></>}
//               {groupEvent?.author?.thumbnail ? (
//                 <img className="w-36" src={`${groupEvent?.author.thumbnail}`}></img>
//               ) : (
//                 <>{groupEvent?.author?.nickname}</>
//               )}

//               <h2
//                 className="w-80 p-3 mx-auto text-3xl text-center rounded"
//                 style={{ backgroundColor: `${editedValues?.color}` }}
//               >
//                 {editedValues?.title}
//               </h2>
//             </header>
//             <main>
//               <section key="date-section" className="FLEX-verA items-center p-4">
//                 <div className="FLEX-horizC">
//                   <div>{displayDate(groupEvent?.startAt).year}</div>
//                   <h2>{displayDate(groupEvent?.startAt).monthDay}</h2>
//                 </div>
//                 <h1 className="text-custom-main">{'>'}</h1>
//                 <div className="FLEX-horizC">
//                   <div>{displayDate(groupEvent?.endAt).year}</div>
//                   <h2>{displayDate(groupEvent?.endAt).monthDay}</h2>
//                 </div>
//               </section>
//               <section key="detail-section" className="FLEX-verC space-x-4 py-4">
//                 <span>
//                   {'멤버 : '}
//                   {editedValues?.member && editedValues?.member.length > 0
//                     ? editedValues?.member.map((mem) => (
//                         <span key={mem.useremail}>{`${mem.nickname}`}</span>
//                       ))
//                     : '없음'}
//                 </span>
//                 <span>
//                   {'중요 : '}
//                   {editedValues?.pinned ? 'Yes' : 'No'}
//                 </span>
//               </section>
//             </main>
//             <EventFeedList />
//           </>
//         )}
//       </div>
//     );
//   } else {
//     return (
//       <div
//         id={`${isOpen ? 'SLIDEdetailIn-right' : 'SLIDEdetailOut-right'}`}
//         className={`h-full SCROLL-hide ${isOpen ? 'event-detail' : ''}`}
//       >
//         {isOpen && (
//           <div>
//             <nav className="FLEX-verB mx-4 mt-4 mb-16">
//               <button className="p-2 hover:bg-custom-light rounded" onClick={handleCancel}>
//                 취소
//               </button>

//               <div>
//                 <button className="p-2 hover:bg-custom-light rounded" onClick={submitUpdateEvent}>
//                   수정 완료
//                 </button>
//               </div>
//             </nav>
//             <header key="event-form">
//               <h2 className="FLEX-horizC h-28 mb-12 mx-auto justify-end">
//                 <input
//                   type="text"
//                   ref={titleRef}
//                   className="w-80 p-3 rounded text-center"
//                   style={{ backgroundColor: `${editedValues?.color}` }}
//                   defaultValue={editedValues?.title}
//                 />
//               </h2>
//             </header>
//             <main>
//               <section key="date-section" className="FLEX-verA h-20 items-center mx-auto mb-12">
//                 <span className="FLEX-horizC py-2 border-b">
//                   Start
//                   <input
//                     type="date"
//                     value={editedValues?.startAt}
//                     onChange={(e) => updateEventValue('startAt', e.target.value)}
//                   />
//                 </span>
//                 <span className="FLEX-horizC py-2 border-b ">
//                   End
//                   <input
//                     type="date"
//                     value={editedValues?.endAt}
//                     onChange={(e) => updateEventValue('endAt', e.target.value)}
//                   />
//                 </span>
//               </section>
//               <section key="member-section" className="m-4">
//                 {'멤버 : '}
//                 <ul>
//                   {CalendarMember?.map((member) => (
//                     <li
//                       key={member}
//                       onClick={() => handleMemberClick(member)}
//                       style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedMembers.includes(member)}
//                         onChange={() => handleMemberClick(member)}
//                         style={{ marginRight: '10px' }}
//                       />
//                       {member} {selectedMembers.includes(member) ? '(selected)' : ''}
//                     </li>
//                   ))}
//                 </ul>
//               </section>
//               <p className="m-4">
//                 {'중요 : '}
//                 <input
//                   type="checkbox"
//                   checked={editedValues?.pinned}
//                   onChange={(e) => updateEventValue('pinned', e.target.checked)}
//                 />
//               </p>
//               <section key="color-section" className="FLEX-horizC m-8">
//                 <HexColorPicker
//                   style={{ width: '350px', height: '180px' }}
//                   color={editedValues?.color || '#ffffff00'}
//                   onChange={(color) => updateEventValue('color', color)}
//                   defaultValue={`${editedValues?.color}`}
//                 />
//                 <input
//                   className="INPUT w-28 my-2 text-center"
//                   type="text"
//                   maxLength={8}
//                   defaultValue={`${editedValues?.color || ''}`}
//                   onChange={(e) => updateEventValue('color', e.target.value)}
//                 ></input>
//               </section>
//             </main>
//           </div>
//         )}
//       </div>
//     );
//   }
// });

import React from 'react';

export default function EventDetail() {
  return <div></div>;
}
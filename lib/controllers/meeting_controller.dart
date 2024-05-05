import 'dart:convert';

import 'package:calendar/api/calendar_delete_service.dart';
import 'package:calendar/api/delete_event_service.dart';
import 'package:calendar/api/event_creates_service.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/models/social_event.dart';
import 'package:calendar/screens/event_detail.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;

class CalendarAppointment {
  final Appointment appointment;
  final String calendarId;
  final String groupeventId;

  CalendarAppointment(
      {required this.appointment,
      required this.calendarId,
      required this.groupeventId});
}

class MeetingController extends GetxController {
  final RxList<CalendarAppointment> calendarAppointments =
      <CalendarAppointment>[].obs;
  final DeleteEventService deleteEventService = DeleteEventService();
  final CalendarEventService eventService = CalendarEventService();
  final DeleteCalendarService deleteCalendarService = DeleteCalendarService();

  void addCalendarAppointment(
      Appointment appointment, String calendarId, String groupeventId) {
    var newCalendarAppointment = CalendarAppointment(
        appointment: appointment,
        calendarId: calendarId,
        groupeventId: groupeventId);
    calendarAppointments.add(newCalendarAppointment);
    update();
  }

  void syncSocialEvents(String jsonData) {
    tz.initializeTimeZones(); // 시간대 데이터 초기화
    var seoul = tz.getLocation('Asia/Seoul'); // 서울 시간대 객체 가져오기

    List<dynamic> jsonResponse = json.decode(jsonData);
    List<SocialEvent> events =
        jsonResponse.map((data) => SocialEvent.fromJson(data)).toList();

    Set<String> newEventCalendarIds =
        events.map((event) => event.userCalendarId).toSet();

    calendarAppointments.removeWhere(
        (appointment) => newEventCalendarIds.contains(appointment.calendarId));

    for (var event in events) {
      // UTC 시간을 서울 시간대로 변환
      DateTime startTimeSeoul = tz.TZDateTime.from(event.startAt, seoul);
      DateTime endTimeSeoul = tz.TZDateTime.from(event.endAt, seoul);
      addCalendarAppointment(
        Appointment(
          startTime: startTimeSeoul,
          endTime: endTimeSeoul,
          subject: event.title ?? 'KaKao',
          color: Colors.yellow,
          isAllDay: false,
        ),
        event.userCalendarId,
        event.socialEventId,
      );
    }
  }

  List<Appointment> getAppointmentsForCalendar(String calendarId) {
    return calendarAppointments
        .where((calendarAppointment) =>
            calendarAppointment.calendarId == calendarId)
        .map((calendarAppointment) => calendarAppointment.appointment)
        .toList();
  }

  List<Appointment> getAllAppointments() {
    return calendarAppointments.map((c) => c.appointment).toList();
  }

  List<CalendarAppointment> getAppointmentsForCalendarAndDate(
      String calendarId, DateTime date) {
    return calendarAppointments
        .where((appointment) =>
            appointment.calendarId == calendarId &&
            appointment.appointment.startTime.day == date.day &&
            appointment.appointment.startTime.month == date.month &&
            appointment.appointment.startTime.year == date.year)
        .toList();
  }

  // 특정 날짜에 해당하는 모든 일정을 가져오는 메소드
  List<CalendarAppointment> getAppointmentsForDate(DateTime date) {
    return calendarAppointments.where((calendarAppointment) {
      return calendarAppointment.appointment.startTime.day == date.day &&
          calendarAppointment.appointment.startTime.month == date.month &&
          calendarAppointment.appointment.startTime.year == date.year;
    }).toList();
  }

  Future<void> deleteCalendarAppointment(String groupEventId) async {
    bool isDeleted = await deleteEventService.deleteEvent(groupEventId);
    if (isDeleted) {
      int index = calendarAppointments
          .indexWhere((item) => item.groupeventId == groupEventId);
      if (index != -1) {
        calendarAppointments.removeAt(index);
        update(); // GetX의 update 메서드를 호출하여 UI 갱신
      }
      Get.back(); // 현재 페이지 닫기
      Get.snackbar('Success', 'Event deleted successfully.');
    } else {
      Get.snackbar('Error', 'Failed to delete event from server.',
          snackPosition: SnackPosition.BOTTOM);
    }
  }

  // 캘린더와 해당 일정들을 삭제하는 메서드
  Future<void> deleteCalendarAndAppointments(String calendarId) async {
    bool isDeleted = await deleteCalendarService.deleteCalendar(calendarId);
    if (isDeleted) {
      Get.find<UserCalendarController>().removeCalendar(calendarId);
      // 로컬 상태에서 해당 캘린더의 일정들을 제거
      calendarAppointments
          .removeWhere((appointment) => appointment.calendarId == calendarId);
      update(); // UI 갱신
      Get.back(); // 현재 페이지 닫기
      Get.snackbar(
          'Success', 'Calendar and its appointments deleted successfully.');
    } else {
      Get.snackbar('Error', 'Failed to delete calendar and its appointments.');
    }
  }

  // 일정 데이터를 초기화하는 메소드
  void clearAppointments() {
    calendarAppointments.clear();
    update(); // UI 갱신을 위해 GetX 상태를 업데이트합니다.
  }

  void showAppointmentsModal(String calendarId, DateTime date) {
    var appointments = getAppointmentsForCalendarAndDate(calendarId, date);
    showModalBottomSheet(
      context: Get.context!,
      isScrollControlled: true,
      useSafeArea: true,
      isDismissible: true,
      builder: (BuildContext context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              width: double.infinity,
              child: Text(
                DateFormat('M월 d일 EEEE', 'ko_KR').format(date),
                style: const TextStyle(color: Colors.black, fontSize: 18),
                textAlign: TextAlign.left,
              ),
            ),
            Expanded(
              child: appointments.isEmpty
                  ? const Center(
                      child: Text(
                        "일정이 없습니다",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  : Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 8),
                      child: ListView.builder(
                        itemCount: appointments.length,
                        itemBuilder: (context, index) {
                          var appointment = appointments[index];
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            child: InkWell(
                              onTap: () {
                                // 이벤트 상세 페이지로 네비게이션
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => EventDetailPage(
                                      eventTitle:
                                          appointment.appointment.subject,
                                      startTime:
                                          appointment.appointment.startTime,
                                      endTime: appointment.appointment.endTime,
                                      isNotified:
                                          false, // 예시 값, 실제 모델에 따라 수정 필요
                                      calendarColor:
                                          appointment.appointment.color,
                                      userProfileImageUrl:
                                          "https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_640.jpg",
                                      groupEventId: appointment.groupeventId,
                                    ),
                                  ),
                                );
                              },
                              child: Row(
                                children: <Widget>[
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Text(
                                        DateFormat('a h:mm', 'ko_KR').format(
                                            appointment.appointment.startTime),
                                        style: const TextStyle(fontSize: 14),
                                      ),
                                      Text(
                                        DateFormat('a h:mm', 'ko_KR').format(
                                            appointment.appointment.endTime),
                                        style: const TextStyle(fontSize: 14),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    height: 30,
                                    width: 10,
                                    decoration: BoxDecoration(
                                      color: appointment.appointment.color,
                                      borderRadius: BorderRadius.circular(5),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      appointment.appointment.subject,
                                      style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  const CircleAvatar(
                                    backgroundImage: NetworkImage(
                                        "https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_640.jpg" // 유저 프로필 이미지 URL
                                        ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
            ),
          ],
        );
      },
    );
  }
}

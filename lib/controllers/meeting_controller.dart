import 'dart:convert';

import 'package:calendar/api/event_creates_service.dart';
import 'package:calendar/models/social_event.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;

class CalendarAppointment {
  final Appointment appointment;
  final String calendarId;

  CalendarAppointment({required this.appointment, required this.calendarId});
}

class MeetingController extends GetxController {
  final RxList<CalendarAppointment> calendarAppointments =
      <CalendarAppointment>[].obs;

  final CalendarEventService eventService = CalendarEventService();

  void addCalendarAppointment(Appointment appointment, String calendarId) {
    var newCalendarAppointment =
        CalendarAppointment(appointment: appointment, calendarId: calendarId);
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
          event.userCalendarId);
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

  // 일정 데이터를 초기화하는 메소드
  void clearAppointments() {
    calendarAppointments.clear();
    update(); // UI 갱신을 위해 GetX 상태를 업데이트합니다.
  }
}

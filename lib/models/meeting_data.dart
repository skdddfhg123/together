import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class MeetingDataSource extends CalendarDataSource {
  late List<CalendarAppointment> calendarAppointments;

  MeetingDataSource(List<CalendarAppointment> source) {
    this.appointments = source.map((e) => e.appointment).toList();
    this.calendarAppointments = source;
  }

  // 특정 일정에 대한 CalendarAppointment 객체 반환
  // CalendarAppointment 객체를 안전하게 찾는 함수
  CalendarAppointment? getAppointmentDetails(Appointment appointment) {
    return calendarAppointments.firstWhere(
      (item) => item.appointment == appointment,
      orElse: () => null!, // 요소가 없을 경우 null 반환
    );
  }
}

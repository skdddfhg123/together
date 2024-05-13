import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllDataSource extends CalendarDataSource {
  late List<CalendarAppointment> calendarAppointments;

  AllDataSource(List<CalendarAppointment> source) {
    this.appointments = source.map((e) => e.appointment).toList();
    this.calendarAppointments = source;
  }
}

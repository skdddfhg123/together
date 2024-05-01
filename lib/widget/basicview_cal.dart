import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:calendar/models/meeting_data.dart';

// 기본 캘린더 뷰 위젯
class BaseCalendarView extends StatelessWidget {
  final CalendarView view;
  final List<Appointment> meetings;

  const BaseCalendarView({
    Key? key,
    required this.view,
    required this.meetings,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SfCalendar(
      view: view,
      dataSource: MeetingDataSource(meetings),
      monthViewSettings: const MonthViewSettings(
          appointmentDisplayMode: MonthAppointmentDisplayMode.appointment),
    );
  }
}

// MonthView 위젯
class MonthView extends StatelessWidget {
  final List<Appointment> meetings;

  const MonthView({super.key, required this.meetings});

  @override
  Widget build(BuildContext context) {
    return BaseCalendarView(
      view: CalendarView.month,
      meetings: meetings,
    );
  }
}

// WeekView 위젯
class WeekView extends StatelessWidget {
  final List<Appointment> meetings;

  const WeekView({super.key, required this.meetings});

  @override
  Widget build(BuildContext context) {
    return BaseCalendarView(
      view: CalendarView.week,
      meetings: meetings,
    );
  }
}

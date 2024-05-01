import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class CalendarAppointment {
  final Appointment appointment;
  final String calendarId;

  CalendarAppointment({required this.appointment, required this.calendarId});
}

class MeetingController extends GetxController {
  final RxList<CalendarAppointment> calendarAppointments =
      <CalendarAppointment>[].obs;

  void addCalendarAppointment(Appointment appointment, String calendarId) {
    var newCalendarAppointment = CalendarAppointment(
      appointment: appointment,
      calendarId: calendarId,
    );
    calendarAppointments.add(newCalendarAppointment);
    update();
  }

  List<Appointment> getAppointmentsForCalendar(String calendarId) {
    return calendarAppointments
        .where((calendarAppointment) =>
            calendarAppointment.calendarId == calendarId)
        .map((calendarAppointment) => calendarAppointment.appointment)
        .toList();
  }

  // 모든 캘린더의 일정을 가져옵니다.
  List<Appointment> getAllAppointments() {
    return calendarAppointments.map((c) => c.appointment).toList();
  }
}

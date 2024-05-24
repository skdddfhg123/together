import 'package:calendar/controllers/meeting_controller.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllDataSource extends CalendarDataSource {
  late List<CalendarAppointment> calendarAppointments;

  AllDataSource(List<CalendarAppointment> source) {
    appointments = source.map((e) => e.appointment).toList();
    calendarAppointments = source;
  }
}

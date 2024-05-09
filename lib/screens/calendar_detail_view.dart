import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/chat_page.dart';
import 'package:calendar/widget/custom_drawer.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import '../models/calendar.dart';

class CalendarDetailView extends StatelessWidget {
  final String calendarId;
  final Function(String) onCalendarChanged; // 페이지 변경을 위한 콜백

  const CalendarDetailView(
      {super.key, required this.calendarId, required this.onCalendarChanged});

  @override
  Widget build(BuildContext context) {
    final calendarController = Get.find<UserCalendarController>();
    final meetingController = Get.find<MeetingController>();

    Calendar? selectedCalendar = calendarController.calendars.firstWhere(
      (cal) => cal.calendarId == calendarId,
    );

    void _onCalendarTapped(CalendarTapDetails details) {
      if (details.targetElement == CalendarElement.calendarCell ||
          details.targetElement == CalendarElement.appointment) {
        final DateTime selectedDate = details.date!;
        final EventSelectionController eventController =
            Get.find<EventSelectionController>();
        eventController.saveSelection(calendarId, selectedDate);
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(selectedCalendar.title),
        actions: [
          IconButton(
            onPressed: () async {
              bool confirmDelete = await showDialog<bool>(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: const Text("캘린더 삭제"),
                        content: const Text(
                            "캘린더를 삭제 하면 캘린더의 일정이 모두 다 삭제 됩니다. 삭제 하시겠습니까?"),
                        actions: <Widget>[
                          TextButton(
                            child: const Text("취소"),
                            onPressed: () => Navigator.of(context).pop(false),
                          ),
                          TextButton(
                            child: const Text("삭제"),
                            onPressed: () => Navigator.of(context).pop(true),
                          ),
                        ],
                      );
                    },
                  ) ??
                  false;

              if (confirmDelete) {
                await meetingController
                    .deleteCalendarAndAppointments(calendarId);
                onCalendarChanged('all_calendar'); // All Calendar 페이지로 리디렉션
              }
            },
            icon: const Icon(Icons.delete_forever_rounded),
          ),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChatPage(
                      calendarId: selectedCalendar.calendarId,
                      calendartitle: selectedCalendar.title),
                ),
              );
            },
            icon: const Icon(Icons.chat),
          ),
        ],
      ),
      drawer: CustomDrawer(onCalendarChanged: (id) => onCalendarChanged(id)),
      body: Obx(() {
        // MeetingController에서 변경 사항을 감지하여 UI를 갱신합니다.
        final dataSource = MeetingDataSource(
            meetingController.getAppointmentsForCalendar(calendarId));
        return SfCalendar(
          view: CalendarView.month,
          firstDayOfWeek: 7,
          monthViewSettings: const MonthViewSettings(
            appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
          ),
          dataSource: dataSource,
          onTap: _onCalendarTapped,
        );
      }),
    );
  }
}

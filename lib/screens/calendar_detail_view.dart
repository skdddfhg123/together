import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
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
      ),
      drawer: Drawer(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: [
                  const DrawerHeader(
                    decoration: BoxDecoration(
                      color: Colors.blue,
                    ),
                    child: Text('캘린더 목록'),
                  ),
                  Obx(
                    () => Column(
                      children: List.generate(
                          calendarController.calendars.length, (index) {
                        final calendar = calendarController.calendars[index];
                        return ListTile(
                          title: Text(calendar.title),
                          onTap: () {
                            Navigator.pop(context);
                            onCalendarChanged(calendar.calendarId);
                          },
                        );
                      }),
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              title: const Text('모든 캘린더 '), // AllCalendar 페이지로 이동하는 버튼
              leading: const Icon(Icons.calendar_today), // 아이콘 추가
              onTap: () {
                Navigator.pop(context); // Drawer 닫기
                onCalendarChanged('all_calendar');
              },
            ),
          ],
        ),
      ),
      body: Obx(() {
        // MeetingController에서 변경 사항을 감지하여 UI를 갱신합니다.
        final dataSource = MeetingDataSource(
            meetingController.getAppointmentsForCalendar(calendarId));
        return SfCalendar(
          view: CalendarView.month,
          firstDayOfWeek: 7,
          monthViewSettings: const MonthViewSettings(
            appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
            showAgenda: true,
          ),
          dataSource: dataSource,
          onTap: _onCalendarTapped,
        );
      }),
    );
  }
}

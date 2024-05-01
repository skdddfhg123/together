import 'package:calendar/controllers/calendar_controller.dart'; // CalendarController를 가져옵니다.
import 'package:calendar/controllers/metting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/all_calendar.dart';
import 'package:calendar/screens/sync_login_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:intl/intl.dart';

import '../models/calendar.dart';

class CalendarDetailView extends StatelessWidget {
  final String calendarId;

  const CalendarDetailView({super.key, required this.calendarId});

  @override
  Widget build(BuildContext context) {
    final calendarController = Get.find<UserCalendarController>();
    final meetingController = Get.find<MeetingController>();

    Calendar? selectedCalendar = calendarController.calendars.firstWhere(
      (cal) => cal.calendarId == calendarId,
    );

    void _showAddAppointmentDialog(DateTime selectedDate) {
      final TextEditingController _subjectController = TextEditingController();
      final TextEditingController _startTimeController = TextEditingController(
        text: DateFormat('yyyy-MM-dd HH:mm').format(selectedDate),
      );
      final TextEditingController _endTimeController = TextEditingController(
        text: DateFormat('yyyy-MM-dd HH:mm')
            .format(selectedDate.add(Duration(hours: 1))),
      );

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Add Appointment'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                TextField(
                  controller: _subjectController,
                  decoration: const InputDecoration(hintText: "Subject"),
                ),
                TextField(
                  controller: _startTimeController,
                  decoration: const InputDecoration(
                      hintText: "Start Time (YYYY-MM-DD HH:MM)"),
                ),
                TextField(
                  controller: _endTimeController,
                  decoration: const InputDecoration(
                      hintText: "End Time (YYYY-MM-DD HH:MM)"),
                ),
              ],
            ),
            actions: <Widget>[
              TextButton(
                child: const Text('Add'),
                onPressed: () {
                  DateTime startTime =
                      DateTime.parse(_startTimeController.text);
                  DateTime endTime = DateTime.parse(_endTimeController.text);
                  Appointment newAppointment = Appointment(
                    startTime: startTime,
                    endTime: endTime,
                    subject: _subjectController.text,
                    color: Colors.blue,
                    id: calendarId.toString(),
                  );
                  meetingController.addCalendarAppointment(
                      newAppointment, calendarId);
                  Navigator.pop(context);
                },
              ),
            ],
          );
        },
      );
    }

    void _onCalendarTapped(CalendarTapDetails details) {
      if (details.targetElement == CalendarElement.calendarCell ||
          details.targetElement == CalendarElement.appointment) {
        final DateTime selectedDate = details.date!;
        _showAddAppointmentDialog(selectedDate); // 선택한 날짜를 다이얼로그에 전달
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
                  Obx(() => Column(
                        children: List.generate(
                            calendarController.calendars.length, (index) {
                          final calendar = calendarController.calendars[index];
                          return ListTile(
                            title: Text(calendar.title),
                            onTap: () {
                              Navigator.pop(context);
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => CalendarDetailView(
                                      calendarId: calendar.calendarId),
                                ),
                              );
                            },
                          );
                        }),
                      )),
                ],
              ),
            ),
            ListTile(
              title: const Text('모든 캘린더 '), // AllCalendar 페이지로 이동하는 버튼
              leading: const Icon(Icons.calendar_today), // 아이콘 추가
              onTap: () {
                Navigator.pop(context); // Drawer 닫기
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => AllCalendar()), // AllCalendar 페이지로 이동
                );
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
          dataSource: dataSource,
          onTap: _onCalendarTapped,
        );
      }),
    );
  }
}

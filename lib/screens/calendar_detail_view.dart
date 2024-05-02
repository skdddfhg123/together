import 'package:calendar/api/event_creates_service.dart';
import 'package:calendar/controllers/calendar_controller.dart'; // CalendarController를 가져옵니다.
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/all_calendar.dart';
import 'package:calendar/screens/sync_login_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

    void _showAddAppointmentDialog(
        BuildContext context, DateTime selectedDate) {
      final TextEditingController _subjectController = TextEditingController();
      Color _selectedColor = selectedCalendar.color;
      DateTime _selectedStartTime = selectedDate;
      DateTime _selectedEndTime = selectedDate.add(Duration(hours: 1));

      // 시간 선택기를 표시하는 함수
      Future<void> _pickDateTime(BuildContext context, bool isStartTime) async {
        final TimeOfDay? pickedTime = await showTimePicker(
          context: context,
          initialTime: TimeOfDay.fromDateTime(
              isStartTime ? _selectedStartTime : _selectedEndTime),
        );
        if (pickedTime != null) {
          final updatedDateTime = DateTime(
            isStartTime ? _selectedStartTime.year : _selectedEndTime.year,
            isStartTime ? _selectedStartTime.month : _selectedEndTime.month,
            isStartTime ? _selectedStartTime.day : _selectedEndTime.day,
            pickedTime.hour,
            pickedTime.minute,
          );
          if (isStartTime) {
            _selectedStartTime = updatedDateTime;
          } else {
            _selectedEndTime = updatedDateTime;
          }
        }
      }

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Add Appointment'),
            content: SingleChildScrollView(
              child: Column(
                children: <Widget>[
                  TextField(
                    controller: _subjectController,
                    decoration: const InputDecoration(labelText: "Subject"),
                  ),
                  ListTile(
                    leading: const Icon(Icons.timer),
                    title: const Text("Start Time"),
                    subtitle: Text(DateFormat('yyyy-MM-dd HH:mm')
                        .format(_selectedStartTime)),
                    onTap: () => _pickDateTime(context, true),
                  ),
                  ListTile(
                    leading: const Icon(Icons.timer_off),
                    title: const Text("End Time"),
                    subtitle: Text(DateFormat('yyyy-MM-dd HH:mm')
                        .format(_selectedEndTime)),
                    onTap: () => _pickDateTime(context, false),
                  ),
                ],
              ),
            ),
            actions: <Widget>[
              TextButton(
                child: const Text('Add'),
                onPressed: () async {
                  SharedPreferences prefs =
                      await SharedPreferences.getInstance();
                  String? token = prefs.getString('token');

                  // 백엔드에 일정 추가 요청
                  bool isCreated = await CalendarEventService().createEvent(
                    _subjectController.text,
                    _selectedStartTime,
                    _selectedEndTime,
                    calendarId,
                    token!,
                    _selectedColor,
                  );

                  if (isCreated) {
                    Appointment newAppointment = Appointment(
                      startTime: _selectedStartTime,
                      endTime: _selectedEndTime,
                      subject: _subjectController.text,
                      color: _selectedColor,
                      id: calendarId.toString(),
                    );
                    meetingController.addCalendarAppointment(
                        newAppointment, calendarId);
                    Navigator.pop(context);
                  } else {
                    Get.snackbar("Error", "Failed to create event");
                  }
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
        _showAddAppointmentDialog(context, selectedDate); // 선택한 날짜를 다이얼로그에 전달
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

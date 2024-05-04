// dialog_service.dart

import 'package:calendar/api/event_creates_service.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class DialogService {
  static void showAddAppointmentDialog(
    BuildContext context,
    DateTime selectedDate,
    Color color,
    String calendarId,
  ) {
    final TextEditingController _subjectController = TextEditingController();
    DateTime _selectedStartTime = selectedDate;
    DateTime _selectedEndTime = selectedDate.add(Duration(hours: 1));
    final MeetingController meetingController = Get.find<MeetingController>();

    void _updateTime(bool isStartTime, DateTime updatedTime) {
      if (isStartTime) {
        _selectedStartTime = updatedTime;
      } else {
        _selectedEndTime = updatedTime;
      }
    }

    Future<void> _pickDateTime(BuildContext context, bool isStartTime) async {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(
            isStartTime ? _selectedStartTime : _selectedEndTime),
      );
      if (pickedTime != null) {
        final updatedDateTime = DateTime(
          _selectedStartTime.year,
          _selectedStartTime.month,
          _selectedStartTime.day,
          pickedTime.hour,
          pickedTime.minute,
        );
        _updateTime(isStartTime, updatedDateTime);
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
                  subtitle: Text(
                      DateFormat('yyyy-MM-dd HH:mm').format(_selectedEndTime)),
                  onTap: () => _pickDateTime(context, false),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Add'),
              onPressed: () async {
                SharedPreferences prefs = await SharedPreferences.getInstance();
                String? token = prefs.getString('token');

                // 백엔드에 일정 추가 요청
                bool isCreated = await CalendarEventService().createEvent(
                  _subjectController.text,
                  _selectedStartTime,
                  _selectedEndTime,
                  calendarId,
                  token!,
                  color,
                );

                if (isCreated) {
                  Appointment newAppointment = Appointment(
                    startTime: _selectedStartTime,
                    endTime: _selectedEndTime,
                    subject: _subjectController.text,
                    color: color,
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
}

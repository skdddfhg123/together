import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:calendar/models/calendar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class CalendarApiService {
  final String apiUrl = "http://15.164.174.224:3000/calendar";
  SharedPreferences? prefs;
  RxBool isLoading = true.obs;

  MeetingController meetingController = Get.find<MeetingController>();

  CalendarApiService() {
    initializePrefs();
  }

  Future<void> initializePrefs() async {
    prefs = await SharedPreferences.getInstance();
    await _loadToken(); // 초기화 시 토큰도 로드
  }

  Future<String?> _loadToken() async {
    return prefs?.getString('token')?.trim();
  }

  Future<List<Calendar>?> loadCalendars() async {
    isLoading.value = true;
    String? token = await _loadToken();
    if (token == null) {
      print(
          'Token is null. Check the login process and ensure token is stored.');
      isLoading.value = false;
      return null;
    }
    try {
      final response = await http.get(
        Uri.parse("$apiUrl/get_calendar"),
        headers: {'Authorization': 'Bearer $token'},
      );

      print(response.body);
      if (response.statusCode == 201 || response.statusCode == 200) {
        List<Calendar> calendars = (json.decode(response.body) as List)
            .map((data) => Calendar.fromJson(data))
            .toList();

        // 각 캘린더에 대한 일정 정보도 함께 로드
        for (var calendar in calendars) {
          await loadAppointmentsForCalendar(calendar, token);
        }
        isLoading.value = false;
        meetingController.update();
        return calendars;
      } else {
        print('Failed to load calendars: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error loading calendars: $e');
      return null;
    }
  }

  // 특정 캘린더에 대한 일정 정보 로드
  Future<void> loadAppointmentsForCalendar(
      Calendar calendar, String token) async {
    var response = await http.get(
        Uri.parse("$apiUrl/group/get/${calendar.calendarId}"),
        headers: {'Authorization': 'Bearer $token'});

    if (response.statusCode == 200) {
      List<dynamic> appointmentData = json.decode(response.body);

      for (var data in appointmentData) {
        Appointment newAppointment = Appointment(
          startTime: DateTime.parse(data['startAt']),
          endTime: DateTime.parse(data['endAt']),
          subject: data['title'],
          color: _parseColor(data['color']),
        );
        // 서버 응답에서 groupeventId 추출
        String groupEventId = data['groupEventId'];

        // 일정과 groupeventId를 meetingController에 추가
        meetingController.addCalendarAppointment(
            newAppointment, calendar.calendarId, groupEventId, false);
      }
      meetingController.update(); // 일정 추가 후 UI 업데이트
    } else {
      print('Failed to load appointments for calendar ${calendar.calendarId}');
    }
  }

  static Color _parseColor(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF' + hexColor; // 색상 코드에 투명도 값이 없다면 FF를 추가
    }
    return Color(int.parse(hexColor, radix: 16));
  }
}

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
        Uri.parse("$apiUrl/get_calendar/v2"),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        print(response.body);
        // 만약 response.body가 문자열 형식의 리스트로 되어 있다면 다시 파싱
        List<dynamic> jsonData = json.decode(response.body);
        if (jsonData is List<String>) {
          jsonData = jsonData.map((e) => json.decode(e)).toList();
        }

        // 이후 데이터 파싱
        List<Calendar> calendars =
            jsonData.map((data) => Calendar.fromJson(data)).toList();

        meetingController.calendarAppointments.clear();
        // 각 캘린더에 대한 일정 정보도 함께 로드
        for (var calendar in calendars) {
          await loadAppointmentsForCalendar(calendar);
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
  Future<void> loadAppointmentsForCalendar(Calendar calendar) async {
    String? token = await _loadToken();

    meetingController.clearAppointmentsForCalendar(calendar.calendarId);

    var response = await http.get(
        Uri.parse("$apiUrl/group/get/v2/${calendar.calendarId}"),
        headers: {'Authorization': 'Bearer $token'});

    if (response.statusCode == 200) {
      List<dynamic> appointmentData = json.decode(response.body);

      for (var data in appointmentData) {
        DateTime startAtUtc = DateTime.parse(data['startAt']);
        DateTime endAtUtc = DateTime.parse(data['endAt']);
        DateTime startAtSeoul = startAtUtc.toLocal();
        DateTime endAtSeoul = endAtUtc.toLocal();

        // 멤버 정보 추출
        List<Member> members =
            (data['member'] as List<dynamic>).map((memberData) {
          return Member.fromJson(memberData);
        }).toList();

        Appointment newAppointment = Appointment(
          startTime: startAtSeoul,
          endTime: endAtSeoul,
          subject: data['title'],
          color: calendar.color,
        );

        // 서버 응답에서 groupEventId 추출
        String groupEventId = data['groupEventId'];
        var author = data['author'];

        // 일정과 groupEventId를 meetingController에 추가
        meetingController.addCalendarAppointment(
          newAppointment,
          calendar.calendarId,
          groupEventId,
          false,
          author['useremail'],
          author['nickname'],
          author['thumbnail'] ??
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4yBIuo_Fy_zUopbWqlVpxfAVZKUQk-EUqmE0Fxt8sQ&s',
          [],
          members,
        );
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

  //////////////////////////////////////멤 버 일 정 ///////////////////////////////////////
  ///
  ///// 멤버들의 일정 정보를 불러오는 메소드
  Future<void> loadMemberAppointmentsForCalendar(String calendarId) async {
    String? token = await _loadToken();
    final String url =
        "http://15.164.174.224:3000/auth/all/getcalendar/V2/$calendarId";

    // 기존 데이터를 비우기
    meetingController.memberAppointments.clear();
    print(calendarId);

    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        List<dynamic> responseData = json.decode(response.body);
        for (var memberData in responseData) {
          MemberAppointment memberAppointment =
              MemberAppointment.fromJson(memberData);
          meetingController.memberAppointments
              .add(memberAppointment); // 멤버 일정 리스트에 추가
        }
        meetingController.update();
      } else {
        print('Failed to load member appointments: ${response.body}');
      }
    } catch (e) {
      print('Error fetching member appointments: $e');
    }
  }
}

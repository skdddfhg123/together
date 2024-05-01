import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:calendar/models/calendar.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CalendarApiService {
  final String apiUrl = "http://15.164.174.224:3000/calendar/get_calendar";
  SharedPreferences? prefs; // SharedPreferences 인스턴스를 필드로 선언

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
    String? token = await _loadToken();
    if (token == null) {
      print(
          'Token is null. Check the login process and ensure token is stored.');
      return null;
    }
    try {
      final response = await http.get(
        Uri.parse(apiUrl),
        headers: {'Authorization': 'Bearer $token'},
      );

      print(response.body);
      if (response.statusCode == 201 || response.statusCode == 200) {
        List<dynamic> calendarJson = json.decode(response.body);
        return calendarJson.map((json) => Calendar.fromJson(json)).toList();
      } else {
        print('Failed to load calendars: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error loading calendars: $e');
      return null;
    }
  }
}

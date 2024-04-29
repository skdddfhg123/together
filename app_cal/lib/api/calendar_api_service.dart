import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:app_cal/models/calendar.dart';

class CalendarAPIService {
  static const baseUrl = 'http://your-backend-url/api/calendars';

  static Future<List<Calendar>> getUserCalendars(String userId) async {
    var response = await http.get(Uri.parse('$baseUrl?userId=$userId'));
    if (response.statusCode == 200) {
      List<dynamic> calendarsJson = json.decode(response.body);
      return calendarsJson.map((json) => Calendar.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load calendars');
    }
  }

  // 캘린더 추가, 수정, 삭제 등의 함수도 비슷하게 구현
}

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CalendarEventService {
  static const String baseUrl =
      'http://15.164.174.224:3000/calendar/group/create/';

  // 색상 객체를 16진수 문자열로 변환하는 함수
  String colorToHex(Color color) {
    return '#${color.value.toRadixString(16).padLeft(8, '0')}';
  }

  // 메서드에 token 파라미터 추가
  Future<bool> createEvent(
    String title,
    DateTime startAt,
    DateTime endAt,
    String calendarId,
    String token,
    Color color,
  ) async {
    var url = Uri.parse(baseUrl + calendarId); // URL 구성
    var response = await http.post(url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token' // 토큰을 헤더에 추가
        },
        body: jsonEncode({
          'title': title,
          'color': colorToHex(color),
          'startAt': startAt.toIso8601String(),
          'endAt': endAt.toIso8601String(),
          'emails': [],
        }));

    if (response.statusCode == 201) {
      print('Event created successfully');
      return true;
    } else {
      print('Failed to create event, status code: ${response.statusCode}');
      return false;
    }
  }
}

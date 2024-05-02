// calendar_create_api_service.dart
import 'package:calendar/models/calendar.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class CalendarCreateApiService {
  final String apiUrl = "http://15.164.174.224:3000/calendar/create";

  String? _token;

  CalendarCreateApiService() {
    _loadToken();
  }

  // 토큰 로드 함수
  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
  }

  // 색상 객체를 16진수 문자열로 변환하는 함수
  String colorToHex(Color color) {
    return '#${color.value.toRadixString(16).padLeft(8, '0')}';
  }

  // 캘린더 생성 함수
  Future<Calendar?> createCalendar(String title, Color color) async {
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_token',
        },
        body: json.encode({
          'title': title,
          'type': colorToHex(color),
        }),
      );

      if (response.statusCode == 201) {
        var data = json.decode(response.body);
        print(response.body);
        return Calendar.fromJson(data); // 캘린더 객체 생성
      } else {
        print('Failed to create calendar: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error creating calendar: $e');
      return null;
    }
  }
}

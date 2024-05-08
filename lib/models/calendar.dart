import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class Calendar {
  final String title;
  final List<String> attendees;
  final String? coverImage;
  final String? bannerImage;
  final String calendarId;
  final DateTime registeredAt;
  final DateTime updatedAt;
  final DateTime? deletedAt;
  final Color color;
  List<Appointment> appointment;

  Calendar({
    required this.title,
    required this.attendees,
    this.coverImage,
    this.bannerImage,
    required this.calendarId,
    required this.registeredAt,
    required this.updatedAt,
    this.deletedAt,
    this.appointment = const [],
    this.color = Colors.blue,
  });

  factory Calendar.fromJson(Map<String, dynamic> json) {
    return Calendar(
      title: json['title'],
      color: _parseColor(json['type']),
      attendees: List<String>.from(json['attendees']),
      coverImage: json['coverImage'] ??
          'https://cdn.pixabay.com/photo/2017/06/10/06/39/calender-2389150_1280.png',
      bannerImage: json['bannerImage'],
      calendarId: json['calendarId'],
      registeredAt: DateTime.parse(json['registeredAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
    );
  }
  static Color _parseColor(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF' + hexColor; // 색상 코드에 투명도 값이 없다면 FF를 추가
    }
    return Color(int.parse(hexColor, radix: 16));
  }
}

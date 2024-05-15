import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class Attendee {
  final String nickname;
  final String useremail;
  final String? thumbnail;

  Attendee({
    required this.nickname,
    required this.useremail,
    this.thumbnail,
  });

  factory Attendee.fromJson(Map<String, dynamic> json) {
    return Attendee(
      nickname: json['nickname'],
      useremail: json['useremail'],
      thumbnail: json['thumbnail'],
    );
  }
}

class Calendar {
  final String title;
  final List<Attendee> attendees;
  final String? coverImage;
  final String? bannerImage;
  final String calendarId;
  final Color color;

  Calendar({
    required this.title,
    required this.attendees,
    this.coverImage,
    this.bannerImage,
    required this.calendarId,
    this.color = Colors.blue,
  });

  factory Calendar.fromJson(Map<String, dynamic> json) {
    List<Attendee> attendeeList = (json['attendees'] as List)
        .map((attendeeJson) => Attendee.fromJson(attendeeJson))
        .toList();

    return Calendar(
      title: json['title'],
      color: _parseColor(json['type'] ?? '#000000'),
      attendees: attendeeList,
      coverImage: json['coverImg'] ??
          'https://dgbdqbfy0cgn6.cloudfront.net/toogether.png',
      bannerImage: json['bannerImage'] ??
          'https://dgbdqbfy0cgn6.cloudfront.net/toogether_small.png',
      calendarId: json['calendarId'],
    );
  }

  static Color _parseColor(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF' + hexColor; // Add FF for opacity if not present
    }
    try {
      return Color(int.parse(hexColor, radix: 16));
    } catch (e) {
      // Return a default color (e.g., blue) if the color code is invalid
      return Colors.blue;
    }
  }
}

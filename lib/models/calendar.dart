import 'package:syncfusion_flutter_calendar/calendar.dart';

class Calendar {
  final String title;
  final String type;
  final List<String> attendees;
  final String? coverImage;
  final String? bannerImage;
  final String calendarId;
  final DateTime registeredAt;
  final DateTime updatedAt;
  final DateTime? deletedAt;
  List<Appointment> appointment;

  Calendar({
    required this.title,
    required this.type,
    required this.attendees,
    this.coverImage,
    this.bannerImage,
    required this.calendarId,
    required this.registeredAt,
    required this.updatedAt,
    this.deletedAt,
    this.appointment = const [],
  });

  factory Calendar.fromJson(Map<String, dynamic> json) {
    return Calendar(
      title: json['title'],
      type: json['type'],
      attendees: List<String>.from(json['attendees']),
      coverImage: json['coverImage'],
      bannerImage: json['bannerImage'],
      calendarId: json['calendarId'],
      registeredAt: DateTime.parse(json['registeredAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
    );
  }
}

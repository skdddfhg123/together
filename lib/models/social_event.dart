class SocialEvent {
  final DateTime startAt;
  final DateTime endAt;
  final String social;
  final String userCalendarId;
  final String? title;
  final String socialEventId;
  final bool deactivatedAt;

  SocialEvent({
    required this.startAt,
    required this.endAt,
    required this.social,
    required this.userCalendarId,
    this.title,
    required this.socialEventId,
    required this.deactivatedAt,
  });

  factory SocialEvent.fromJson(Map<String, dynamic> json) {
    return SocialEvent(
      startAt: DateTime.parse(json['startAt']),
      endAt: DateTime.parse(json['endAt']),
      social: json['social'],
      userCalendarId: json['userCalendar']['userCalendarId'],
      title: json['title'],
      socialEventId: json['socialEventId'],
      deactivatedAt: json['deactivatedAt'],
    );
  }
}

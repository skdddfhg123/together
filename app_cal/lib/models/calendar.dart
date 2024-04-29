class Calendar {
  final String id;
  final String title;
  final String coverImage;
  final String type;
  final List<String> user;
  final List<String> userCalendar;

  Calendar(
      {required this.id,
      required this.title,
      required this.coverImage,
      required this.type,
      required this.user,
      required this.userCalendar});

  factory Calendar.fromJson(Map<String, dynamic> json) {
    return Calendar(
      id: json['calendar_id'],
      title: json['title'],
      coverImage: json['cover_image'],
      user: List<String>.from(json['user']),
      userCalendar: List<String>.from(json['user_calendar']),
      type: json['type'],
    );
  }
}

import 'package:get/get.dart';

class Calendar {
  String id;
  String name;

  Calendar({required this.id, required this.name});
}

class CalendarController extends GetxController {
  var calendars = <Calendar>[].obs;

  void addCalendar(String name) {
    calendars.add(Calendar(id: DateTime.now().toString(), name: name));
  }
}

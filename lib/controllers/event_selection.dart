import 'package:get/get.dart';

class EventSelectionController extends GetxController {
  var selectedDate = Rxn<DateTime>();
  var selectedCalendarId = Rxn<String>();

  void saveSelection(String calendarId, DateTime date) {
    selectedCalendarId.value = calendarId;
    selectedDate.value = date;
  }
}

// controllers/event_selection.dart
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:get/get.dart';

class EventSelectionController extends GetxController {
  var selectedDate = Rxn<DateTime>();
  var selectedCalendarId = Rxn<String>();
  var lastTappedDate = Rxn<DateTime>();

  void saveSelection(String calendarId, DateTime date) {
    if (lastTappedDate.value == date) {
      // 같은 날짜를 다시 탭한 경우
      lastTappedDate.value = null; // 상태 초기화
      Get.find<MeetingController>()
          .showAppointmentsModal(calendarId, date); // 모달 호출
    } else {
      lastTappedDate.value = date;
      selectedCalendarId.value = calendarId;
      selectedDate.value = date;
    }
  }
}

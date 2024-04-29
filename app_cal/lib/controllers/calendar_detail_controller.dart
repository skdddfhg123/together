import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class CalendarDetailController extends GetxController {
  final CalendarController calendarController = CalendarController();

  var selectedDate = DateTime.now().obs; // 반응형 변수로 변경
  var appBarTitle = ''.obs;
  var selectedIndex = 0.obs;

  @override
  void onInit() {
    super.onInit();
    appBarTitle.value = formatDate(selectedDate.value); // value 접근 수정
  }

  void moveToToday() {
    print("Moving to today: ${DateTime.now()}");
    selectedDate.value = DateTime.now();
    print("Selected Date Updated: ${selectedDate.value}");
    appBarTitle.value = formatDate(selectedDate.value);
    calendarController.displayDate = selectedDate.value;
  }

  String formatDate(DateTime date) {
    return '${date.year}년 ${date.month}월';
  }

  void selectDate(DateTime date) {
    selectedDate.value = date; // 반응형 상태 업데이트
    appBarTitle.value = formatDate(selectedDate.value); // value 접근 수정
    calendarController.displayDate = selectedDate.value; // value 접근 수정
  }

  void updateMonthView(DateTime firstDateOfMonth) {
    DateTime now = DateTime.now();
    DateTime today = DateTime(now.year, now.month, now.day);
    bool isCurrentMonth = firstDateOfMonth.year == now.year &&
        firstDateOfMonth.month == now.month;

    if (isCurrentMonth) {
      if (calendarController.selectedDate != today) {
        calendarController.selectedDate = today;
        calendarController.displayDate = today;
      }
    } else {
      if (calendarController.selectedDate != firstDateOfMonth) {
        calendarController.selectedDate = firstDateOfMonth;
        calendarController.displayDate = firstDateOfMonth;
      }
    }

    appBarTitle.value = formatDate(firstDateOfMonth); // AppBar 제목 업데이트
  }
}

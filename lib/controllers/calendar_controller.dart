import 'package:calendar/api/get_calendar_service.dart';
import 'package:get/get.dart';
import 'package:calendar/models/calendar.dart';
import 'package:calendar/api/calendar_create_service.dart';

class UserCalendarController extends GetxController {
  final CalendarApiService getapiService;

  UserCalendarController(this.getapiService);
  RxList<Calendar> calendars = <Calendar>[].obs;
  final CalendarCreateApiService apiService = CalendarCreateApiService();

  @override
  void onInit() {
    super.onInit();
    loadCalendars();
  }

  // 캘린더를 추가하는 비동기 함수
  Future<void> addCalendar(String name, String type) async {
    try {
      Calendar? newCalendar = await apiService.createCalendar(name, type);
      if (newCalendar != null) {
        calendars.add(newCalendar); // 캘린더 리스트에 추가
        print(calendars.last);
        update(); // GetX 업데이트 호출
      }
    } catch (e) {
      print('Error adding calendar: $e');
    }
  }

  Future<void> loadCalendars() async {
    List<Calendar>? loadedCalendars = await getapiService.loadCalendars();
    if (loadedCalendars != null) {
      calendars.assignAll(loadedCalendars);
    }
  }
}

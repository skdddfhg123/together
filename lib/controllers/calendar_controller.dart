import 'package:calendar/api/get_calendar_service.dart';
import 'package:flutter/material.dart';
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
  Future<void> addCalendar(String name, Color color) async {
    try {
      Calendar? newCalendar = await apiService.createCalendar(name, color);
      if (newCalendar != null) {
        calendars.add(newCalendar); // 캘린더 리스트에 추가
        print(calendars.last.title);
        update(); // GetX 업데이트 호출
      }
    } catch (e) {
      print('Error adding calendar: $e');
    }
  }

  // 캘린더를 리스트에서 삭제하는 비동기 함수
  void removeCalendar(String calendarId) {
    calendars.removeWhere((calendar) => calendar.calendarId == calendarId);
    update(); // GetX를 통해 상태 업데이트 및 UI 갱신
  }

  Future<void> loadCalendars() async {
    List<Calendar>? loadedCalendars = await getapiService.loadCalendars();
    if (loadedCalendars != null) {
      calendars.assignAll(loadedCalendars);
    }
  }
}

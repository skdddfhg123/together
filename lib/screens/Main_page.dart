import 'package:calendar/calendar_utils.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/screens/alarm.dart';
import 'package:calendar/screens/memo.dart';
import 'package:calendar/widget/custom_bottom_navbar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'calendar_detail_view.dart';
import 'all_calendar.dart';

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);

  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _selectedIndex = 0;
  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      AllCalendar(onCalendarChanged: _changePage),
      const MemoPage(),
      const MemoPage(),
      const NotificationPage(),
      const MemoPage()
    ];
  }

  void _changePage(String calendarId) {
    setState(() {
      if (calendarId == 'all_calendar') {
        _pages[0] = AllCalendar(onCalendarChanged: _changePage);
      } else {
        _pages[0] = CalendarDetailView(
            calendarId: calendarId, onCalendarChanged: _changePage);
      }
      _selectedIndex = 0; // 일정 탭으로 돌아가기
    });
  }

  void _onItemTapped(int index) {
    if (index == 2) {
      // '작성' 탭
      final EventSelectionController eventController =
          Get.find<EventSelectionController>();
      if (eventController.selectedCalendarId.value != null &&
          eventController.selectedDate.value != null) {
        final calendarId = eventController.selectedCalendarId.value!;
        final selectedDate = eventController.selectedDate.value!;
        final UserCalendarController calendarController =
            Get.find<UserCalendarController>();
        final selectedCalendar = calendarController.calendars.firstWhere(
          (cal) => cal.calendarId == calendarId,
        );

        print(selectedCalendar.title);

        if (selectedCalendar != null) {
          DialogService.showAddAppointmentDialog(
            context,
            selectedDate,
            selectedCalendar.color,
            calendarId,
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Selected calendar not found")));
        }
      } else {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text("No event selected")));
      }
    } else {
      setState(() {
        _selectedIndex = index; // 다른 탭을 선택했을 때만 인덱스 변경
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: CustomBottomNavBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}

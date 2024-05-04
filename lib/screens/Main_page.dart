import 'package:calendar/screens/alarm.dart';
import 'package:calendar/screens/memo.dart';
import 'package:calendar/widget/custom_bottom_navbar.dart';
import 'package:flutter/material.dart';
import 'calendar_detail_view.dart'; // 상세 캘린더 뷰 임포트
import 'all_calendar.dart'; // 모든 캘린더 페이지

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
    setState(() {
      _selectedIndex = index;
    });
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

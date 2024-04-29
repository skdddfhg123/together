import 'package:app_cal/screens/monthview_cal.dart';
import 'package:app_cal/screens/shadertest.dart';
import 'package:app_cal/screens/testcal.dart';
import 'package:app_cal/screens/testscreen.dart';
import 'package:flutter/material.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;

  final List<Widget> _widgetOptions = [
    AllCalendar(key: AllCalendar.calendarKey),
    OutlinedText(),
    const TestCal(),
    const TestScreen(),
    const TestScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      if (_selectedIndex == index && index == 0) {
        // '일정' 탭이 0번 인덱스
        AllCalendar.calendarKey.currentState
            ?.moveToToday(); // moveToToday 메소드 호출
      } else {
        _selectedIndex = index;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(
              Icons.calendar_month,
              color: Color.fromARGB(255, 68, 166, 246),
            ),
            label: '일정',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.speaker_notes_rounded,
              color: Color.fromARGB(255, 68, 166, 246),
            ),
            label: '메모',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.add_circle_outline,
              color: Color.fromARGB(255, 68, 166, 246),
            ),
            label: '작성',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.notifications_active,
              color: Color.fromARGB(255, 68, 166, 246),
            ),
            label: '알림',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.settings,
              color: Color.fromARGB(255, 68, 166, 246),
            ),
            label: '설정',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.lightGreen,
        onTap: _onItemTapped,
      ),
    );
  }
}

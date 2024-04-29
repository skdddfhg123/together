import 'package:app_cal/app.dart';
import 'package:app_cal/screen/login_page.dart';
import 'package:app_cal/screen/monthview_cal.dart';
import 'package:app_cal/screen/shadertest.dart';
import 'package:app_cal/screen/signup_page.dart';
import 'package:app_cal/screen/testcal.dart';
import 'package:app_cal/screen/testscreen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:month_year_picker/month_year_picker.dart';
import 'package:syncfusion_localizations/syncfusion_localizations.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        SfGlobalLocalizations.delegate,
        MonthYearPickerLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('ko'),
      ],
      locale: const Locale('ko'),
      title: 'Together',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
        fontFamily: App.font,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => LoginPage(), // 로그인 페이지를 초기 페이지로 설정
        '/home': (context) => const MyHomePage(), // 메인 홈 페이지
        '/signup': (context) => SignupPage(), // 회원가입 페이지
      },
    );
  }
}

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

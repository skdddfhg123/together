import 'package:calendar/api/calendar_create_service.dart';
import 'package:calendar/api/get_calendar_service.dart';
import 'package:calendar/api/kakao_auth_service.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/screens/Main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'controllers/auth_controller.dart';
import 'controllers/meeting_controller.dart';
import 'screens/login_page.dart';
import 'screens/signup_page.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SharedPreferences prefs = await SharedPreferences.getInstance();
  // 로그로 삭제 확인
  print("Deleting token...");
  await prefs.remove('token');
  print("Token deleted.");
  var token = prefs.getString('token');
  print("Token after deletion: $token");

  KakaoSdk.init(
      nativeAppKey: 'e93a75bf0305cc39ffdd47eeb2815a7a',
      javaScriptAppKey: '51a0dace612e8ce24408eae4fbe6e10d');

  Get.put(AuthController());
  Get.put(MeetingController());
  // 종속성 등록 순서 조정
  Get.put(CalendarCreateApiService());
  Get.put(KakaoAuthService());
  Get.put(EventSelectionController());

  var calendarService = CalendarApiService();
  await calendarService.initializePrefs(); // 서비스 초기화 보장
  Get.put(UserCalendarController(calendarService)); // 의존성 주입
  runApp(MyApp(token: token));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, this.token});

  final String? token;

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Group Calendar App',
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''),
        Locale('ko', ''),
      ],
      // initialRoute: token != null ? '/home' : '/',
      initialRoute: '/',
      getPages: [
        GetPage(name: '/', page: () => LoginPage()),
        GetPage(name: '/signup', page: () => SignupPage()),
        GetPage(name: '/home', page: () => const MainPage()),
      ],
    );
  }
}

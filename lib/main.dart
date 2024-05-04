import 'package:calendar/api/get_calendar_service.dart';
import 'package:calendar/api/kakao_auth_service.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/screens/Main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'controllers/auth_controller.dart';
import 'controllers/meeting_controller.dart';
import 'screens/login_page.dart';
import 'screens/signup_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SharedPreferences prefs = await SharedPreferences.getInstance();
  var token = prefs.getString('token');

  KakaoSdk.init(
      nativeAppKey: 'e93a75bf0305cc39ffdd47eeb2815a7a',
      javaScriptAppKey: '51a0dace612e8ce24408eae4fbe6e10d');

  Get.put(AuthController());
  Get.put(MeetingController());
  Get.put(KakaoAuthService());

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
      // initialRoute: token != null ? '/home' : '/',
      initialRoute: '/',
      getPages: [
        GetPage(name: '/', page: () => LoginPage()),
        GetPage(name: '/signup', page: () => SignupPage()),
        GetPage(name: '/home', page: () => MainPage()),
      ],
    );
  }
}

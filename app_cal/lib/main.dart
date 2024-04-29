import 'package:app_cal/controllers/calendar_detail_controller.dart';
import 'package:app_cal/models/app.dart';
import 'package:app_cal/controllers/auth_controller.dart';
import 'package:app_cal/screens/home_page.dart';
import 'package:app_cal/screens/login_page.dart';
import 'package:app_cal/screens/signup_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:month_year_picker/month_year_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_localizations/syncfusion_localizations.dart';
import 'package:get/get.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SharedPreferences prefs = await SharedPreferences.getInstance();
  var token = prefs.getString('token');
  runApp(MyApp(token: token));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, this.token});

  final String? token;

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    Get.lazyPut(() => AuthController(), fenix: true);
    Get.lazyPut(() => CalendarDetailController(), fenix: true);
    return GetMaterialApp(
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
      initialRoute: token != null ? '/home' : '/',
      routes: {
        '/': (context) => LoginPage(), // 로그인 페이지를 초기 페이지로 설정
        '/home': (context) => const MyHomePage(), // 메인 홈 페이지
        '/signup': (context) => SignupPage(), // 회원가입 페이지
      },
    );
  }
}

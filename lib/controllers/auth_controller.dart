import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:get/get.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthController extends GetxController {
  var isLoggedIn = false.obs;

  Future<void> setAccessToken(String token) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);

    // 저장된 토큰 확인
    String? savedToken = prefs.getString('token');
    print('Saved token: $savedToken');
    isLoggedIn.value = true;
    if (isLoggedIn.value) {
      Get.find<UserCalendarController>().loadCalendars();
    }
  }

  Future<void> logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    isLoggedIn.value = false;

    Get.find<MeetingController>().clearAppointments();
  }
}

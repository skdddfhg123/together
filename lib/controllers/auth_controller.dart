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
    // 삭제 전 토큰 상태 확인
    print('Deleting token, current token: ${prefs.getString('token')}');

    await prefs.remove('token');

    // 삭제 후 토큰 상태 확인
    print('Token after deletion: ${prefs.getString('token')}');
    isLoggedIn.value = false;

    Get.find<MeetingController>().clearAppointments();
  }
}

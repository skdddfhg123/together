import 'dart:convert'; // jsonEncode를 사용하기 위해 필요
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

class KakaoAuthService {
  final String serverUrl = "http://15.164.174.224:3000/kakao/calendar";
  final MeetingController meetingController = Get.find<MeetingController>();

  Future<void> sendTokensToServer(
      String jwtToken, String accessToken, String? refreshToken) async {
    try {
      var response = await http.post(
        Uri.parse(serverUrl),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $jwtToken',
        },
        body: jsonEncode({
          'kakaoToken': accessToken,
          // 'refreshToken': refreshToken,
        }),
      );

      if (response.statusCode == 201) {
        // 서버로부터 응답 처리
        meetingController.syncSocialEvents(response.body);
        print(response.body);
        print('Tokens successfully sent to the server');
      } else {
        // 에러 처리
        print(
            'Failed to send tokens to the server, status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error sending tokens to the server: $e');
    }
  }
}

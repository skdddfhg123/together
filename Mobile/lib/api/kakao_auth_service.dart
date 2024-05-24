import 'dart:convert'; // jsonEncode를 사용하기 위해 필요
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

class KakaoAuthService {
  final String syncurl = "http://15.164.174.224:3000/kakao/get/calendar";
  final String loginurl = "http://15.164.174.224:3000/kakao/save/token";
  final MeetingController meetingController = Get.find<MeetingController>();

  Future<void> saveTokenToServer(
      String jwtToken, String accessToken, String? refreshToken) async {
    try {
      var response = await http.post(
        Uri.parse(loginurl),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $jwtToken',
        },
        body: jsonEncode({
          'kakaoAccessToken': accessToken,
          'kakaoRefreshToken': refreshToken,
        }),
      );
      if (response.statusCode == 201) {
        print('Token successfully sent to the server');
      } else {
        print('Failed to send token: ${response.body}');
      }
    } catch (e) {
      print('Error sending token to server: $e');
    }
  }

  Future<void> sendTokensToServer(
      String jwtToken, String accessToken, String? refreshToken) async {
    try {
      var response = await http.post(
        Uri.parse(syncurl),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $jwtToken',
        },
        body: jsonEncode({
          'kakaoAccessToken': accessToken,
        }),
      );

      if (response.statusCode == 201) {
        // 서버로부터 응답 처리
        print(response.body);
        var data = jsonDecode(response.body);
        meetingController.syncSocialEvents(data["resultArray"]);
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

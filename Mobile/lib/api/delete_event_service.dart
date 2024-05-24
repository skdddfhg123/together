import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class DeleteEventService {
  static const String baseUrl = 'http://15.164.174.224:3000/calendar/group/';
  SharedPreferences? prefs;

  DeleteEventService() {
    initializePrefs();
  }

  Future<void> initializePrefs() async {
    prefs = await SharedPreferences.getInstance();
    await _loadToken(); // 초기화 시 토큰도 로드
  }

  Future<String?> _loadToken() async {
    return prefs?.getString('token')?.trim();
  }

  // 이벤트 삭제 메서드
  Future<bool> deleteEvent(String groupEventId) async {
    String? token = await _loadToken();
    var url = Uri.parse(baseUrl + 'remove/$groupEventId'); // URL 구성

    var response = await http.patch(url, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token', // 토큰을 헤더에 추가
    });

    if (response.statusCode == 200) {
      print('Event deleted successfully');
      return true; // 성공적으로 삭제됨
    } else {
      print('Failed to delete event, status code: ${response.statusCode}');
      return false; // 삭제 실패
    }
  }
}

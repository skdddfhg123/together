import 'dart:convert';
import 'dart:io';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/post.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http_parser/http_parser.dart';

class FeedService {
  static const String baseUrl = 'http://15.164.174.224:3000/feed/create/';
  SharedPreferences? prefs;

  FeedService() {
    initializePrefs();
  }

  Future<void> initializePrefs() async {
    prefs = await SharedPreferences.getInstance();
  }

  Future<String?> _loadToken() async {
    return prefs?.getString('token')?.trim();
  }

  // 피드 및 이미지 생성 메서드
  Future<FeedWithId?> createFeedWithImages(
      String content, String groupEventId, List<File> images) async {
    String? token = await _loadToken();
    var url = Uri.parse(baseUrl + groupEventId);

    var request = http.MultipartRequest('POST', url)
      ..headers['Authorization'] = 'Bearer $token'
      ..headers['Content-Type'] = 'application/json'
      ..fields['title'] = 'title'
      ..fields['content'] = content
      ..fields['feedType'] = 1.toString();

    // 이미지 파일을 멀티파트 형식으로 추가
    for (var image in images) {
      request.files.add(
        await http.MultipartFile.fromPath(
          'images',
          image.path,
          contentType: MediaType('image', 'jpeg'), // 이미지 타입에 따라 변경할 수 있습니다.
        ),
      );
    }

    try {
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('Feed created successfully with images');
        print('Response: ${response.body}');
        Feed newfeed = Feed.fromJson(jsonDecode(response.body));
        print(newfeed); // print 출력 안됨. newfeed 문제
        String groupeventId = jsonDecode(response.body)['feed']['groupEventId'];
        String feedId = jsonDecode(response.body)['feed']['feedId'];
        return FeedWithId(
            feed: newfeed, groupeventId: groupeventId, feedId: feedId);
      } else {
        print(
            'Failed to create feed with images, status code: ${response.statusCode}');
        return null; // 피드 생성 실패
      }
    } catch (e) {
      print('Error creating feed with images: $e');
      return null;
    }
  }

  // 피드 삭제 메서드
  Future<bool> deleteFeed(String feedId) async {
    String? token = await _loadToken();
    var url = Uri.parse('http://15.164.174.224:3000/feed/remove/$feedId');

    try {
      // PATCH 요청 보내기
      var response = await http.patch(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // 인증 토큰을 헤더에 추가
        },
      );

      if (response.statusCode == 200) {
        print('Feed deleted successfully');
        return true; // 피드 삭제 성공
      } else {
        print('Failed to delete feed, status code: ${response.statusCode}');
        return false; // 피드 삭제 실패
      }
    } catch (e) {
      print('Error deleting feed: $e');
      return false;
    }
  }

  Future<List<FeedWithId>> loadFeedsForGroup(String groupeventId) async {
    String? token = await _loadToken();
    var url = Uri.parse(
        'http://15.164.174.224:3000/feed/get/groupevent/$groupeventId');

    try {
      var response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      });
      if (response.statusCode == 200) {
        print('피드로드하기 성공');
        List<dynamic> feedsJson = json.decode(response.body);
        return feedsJson
            .map((json) => FeedWithId.fromJson(json, groupeventId))
            .toList();
      } else {
        print(
            'Failed to load feeds for group $groupeventId, status code: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error loading feeds for group $groupeventId: $e');
      return [];
    }
  }

  Future<List<FeedWithId>> loadFeedsForCalendar(String calendarId) async {
    String? token = await _loadToken();
    var url =
        Uri.parse('http://15.164.174.224:3000/feed/get/calendar/$calendarId');

    try {
      var response = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      });
      if (response.statusCode == 200) {
        print('피드로드하기 성공');
        List<dynamic> feedsJson = json.decode(response.body);
        return feedsJson
            .map((json) => FeedWithId.fromJson(json, calendarId))
            .toList();
      } else {
        print(
            'Failed to load feeds for calendar $calendarId, status code: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error loading feeds for calendar $calendarId: $e');
      return [];
    }
  }
}

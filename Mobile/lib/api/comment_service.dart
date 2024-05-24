import 'dart:convert';
import 'package:calendar/models/comment.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CommentService {
  final String baseUrl = 'http://15.164.174.224:3000';

  SharedPreferences? prefs;

  CommentService() {
    initializePrefs();
  }

  Future<void> initializePrefs() async {
    prefs = await SharedPreferences.getInstance();
  }

  Future<String?> _loadToken() async {
    return prefs?.getString('token')?.trim();
  }

  // 특정 피드의 댓글을 불러오는 메서드
  Future<List<Comment>> fetchComments(String feedId) async {
    String? token = await _loadToken();
    var url = Uri.parse('$baseUrl/feed/comment/$feedId');
    var response = await http.get(url, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token'
    });
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Comment.fromJsonLoad(json)).toList();
    } else {
      throw Exception('Failed to load comments');
    }
  }

  // 특정 피드에 댓글을 생성하는 메서드
  Future<Comment?> postComment(
      String feedId, String content, String nickname, String thumbnail) async {
    String? token = await _loadToken();
    var url = Uri.parse('$baseUrl/feed/comment/create/$feedId');
    var response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: json.encode({'content': content}),
    );
    if (response.statusCode == 201) {
      return Comment.fromJson(json.decode(response.body), nickname, thumbnail);
    } else {
      throw Exception('Failed to post comment');
    }
  }
}

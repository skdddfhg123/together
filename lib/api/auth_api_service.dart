import 'package:calendar/models/userinfo.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class AuthAPIService {
  static Future<bool> login(String email, String password) async {
    var response = await http.post(
      Uri.parse('http://15.164.174.224:3000/auth/login/v2'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'useremail': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      var data = json.decode(response.body);
      var token = data['accessToken'];
      var userInfo =
          UserInfo(useremail: data['useremail'], nickname: data['nickname']);
      Get.find<AuthController>().setAccessToken(token);
      Get.find<AuthController>().setUser(userInfo);
      return true;
    } else {
      return false;
    }
  }
}

import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class AuthAPIService {
  static Future<bool> login(String email, String password) async {
    var response = await http.post(
      Uri.parse('http://15.164.174.224:3000/auth/login'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'useremail': email,
        'password': password,
      }),
    );

    print(response.body);

    if (response.statusCode == 201) {
      var token = json.decode(response.body)['accessToken'];
      Get.find<AuthController>().setAccessToken(token);
      return true;
    } else {
      return false;
    }
  }
}

import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:get/get.dart';
import '../provider/auth_controller.dart';

class AuthAPIService {
  static Future<bool> login(String email, String password) async {
    var response = await http.post(
      Uri.parse('http://your-backend-url/api/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'useremail': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      var token = json.decode(response.body)['token'];
      Get.find<AuthController>().setAccessToken(token);
      return true;
    } else {
      return false;
    }
  }
}

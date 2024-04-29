import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class AuthAPIService {
  static Future<bool> login(String email, String password) async {
    var response = await http.post(
      Uri.parse('http://192.168.1.49/auth/login'),
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

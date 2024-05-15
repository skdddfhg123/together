import 'package:calendar/api/auth_api_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LoginPage extends StatelessWidget {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  LoginPage({super.key});

  Future<void> loginUser() async {
    bool loginSuccess = await AuthAPIService.login(
      emailController.text,
      passwordController.text,
    );

    if (loginSuccess) {
      Get.offAllNamed('/home'); // 로그인 성공 후 홈 페이지로 이동
    } else {
      Get.snackbar(
        '로그인 실패',
        'Email 혹은 Password 를 다시 확인해주세요.',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Login")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: <Widget>[
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            ElevatedButton(
              onPressed: loginUser,
              child: const Text('Login'),
            ),
            TextButton(
              onPressed: () => Get.toNamed('/signup'),
              child: const Text('Sign up'),
            ),
          ],
        ),
      ),
    );
  }
}

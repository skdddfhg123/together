import 'package:flutter/material.dart';

class ErrorPage extends StatelessWidget {
  const ErrorPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/images/error.gif'),
            const SizedBox(
              height: 10,
            ),
            const Text('피드 모아보기는 "그룹 캘린더" 내의 기능입니다.'),
          ],
        ),
      ),
    );
  }
}

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
            const Text('준비중인 기능입니다.'),
          ],
        ),
      ),
    );
  }
}

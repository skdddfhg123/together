import 'package:flutter/material.dart';

class TestScreen extends StatelessWidget {
  const TestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('테스트 페이지'),
      ),
      body: const Center(
        child: Text('테스트 페이지'),
      ),
    );
  }
}

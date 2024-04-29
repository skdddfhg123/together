import 'package:flutter/material.dart';

class OutlinedText extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // 윤곽선(Stroke)을 그리는 텍스트
            Text(
              'Hello, World!',
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.bold,
                foreground: Paint()
                  ..style = PaintingStyle.stroke
                  ..strokeWidth = 4 // 윤곽선의 두께
                  ..color = Colors.red, // 윤곽선의 색
              ),
            ),
            // 실제 텍스트
            Text(
              'Hello, World!',
              style: TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.bold,
                color: Colors.black, // 텍스트의 색
              ),
            ),
          ],
        ),
      ),
    );
  }
}

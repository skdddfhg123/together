import 'package:flutter/material.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const CustomBottomNavBar({
    Key? key,
    required this.selectedIndex,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.calendar_month_outlined),
          label: '일정',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.feed),
          label: '피드',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.add_box),
          label: '작성',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications),
          label: '알림',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings),
          label: '설정',
        ),
      ],
      currentIndex: selectedIndex,
      selectedItemColor: Colors.blue, // 선택된 아이템의 색상
      unselectedItemColor: Colors.grey, // 선택되지 않은 아이템의 색상
      onTap: onItemTapped,
      type: BottomNavigationBarType.fixed, // 고정된 타입
    );
  }
}

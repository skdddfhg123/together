import 'package:app_cal/screens/calendar_detail_page.dart';
import 'package:app_cal/screens/home_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:app_cal/controllers/calendar_controller.dart';
import '../controllers/auth_controller.dart';

class CustomDrawer extends StatelessWidget {
  CustomDrawer({Key? key}) : super(key: key);
  final CalendarController calendarController = Get.put(CalendarController());

  @override
  Widget build(BuildContext context) {
    TextEditingController calendarNameController = TextEditingController();

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: const BoxDecoration(
              color: Colors.blue,
            ),
            child: TextButton(
              style: TextButton.styleFrom(
                textStyle: const TextStyle(fontSize: 20),
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const MyHomePage(), // MyHomePage로 이동
                    settings: const RouteSettings(
                      arguments: 0, // 선택된 index를 전달할 수 있음 (원하는 경우)
                    ),
                  ),
                );
              },
              child: const Text('모든 캘린더'),
            ),
          ),
          Obx(
            () => ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: calendarController.calendars.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(calendarController.calendars[index].name),
                  onTap: () {
                    Get.to(() => CalendarDetailPage(
                        calendarName:
                            calendarController.calendars[index].name));
                  },
                );
              },
            ),
          ),
          ListTile(
            leading: const Icon(Icons.add),
            title: const Text('캘린더 추가', style: TextStyle(fontSize: 20)),
            onTap: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: const Text('캘린더 추가'),
                    content: TextField(
                      controller: calendarNameController,
                      decoration: const InputDecoration(hintText: "캘린더 이름"),
                    ),
                    actions: <Widget>[
                      TextButton(
                        child: const Text('추가'),
                        onPressed: () {
                          if (calendarNameController.text.isNotEmpty) {
                            calendarController
                                .addCalendar(calendarNameController.text);
                            Navigator.of(context).pop();
                          }
                        },
                      ),
                    ],
                  );
                },
              );
            },
          ),
          ListTile(
            title: const Text('임시 로그아웃'),
            onTap: () {
              Get.find<AuthController>().logout();
              Get.offAllNamed('/');
            },
          ),
        ],
      ),
    );
  }
}

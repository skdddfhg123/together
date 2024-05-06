import 'package:calendar/controllers/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/calendar_utils.dart';

class CustomDrawer extends StatelessWidget {
  final Function(String) onCalendarChanged;

  const CustomDrawer({
    super.key,
    required this.onCalendarChanged,
  });

  @override
  Widget build(BuildContext context) {
    final calendarController = Get.find<UserCalendarController>();

    return Drawer(
      child: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                DrawerHeader(
                  decoration: BoxDecoration(
                    color: Colors.blue[200],
                  ),
                  child: Column(
                    children: [
                      ListTile(
                        title: const Text('연동 앱 관리'),
                        trailing: const Icon(Icons.phone_android), // 아이콘 추가
                        onTap: () {
                          Navigator.of(context).pop();
                          showSyncLoginPageModal(context);
                        }, // 클릭 이벤트 핸들러
                      ),
                      syncButton(),
                    ],
                  ),
                ),
                Obx(() => Column(
                      children: List.generate(
                          calendarController.calendars.length, (index) {
                        final calendar = calendarController.calendars[index];
                        return ListTile(
                          title: Text(calendar.title),
                          onTap: () {
                            Navigator.pop(context);
                            onCalendarChanged(calendar.calendarId);
                          },
                        );
                      }),
                    )),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.add),
            title: const Text('캘린더 추가'),
            onTap: () {
              Navigator.pop(context);
              showAddCalendarDialog(context);
            },
          ),
          ListTile(
            title: const Text('모든 캘린더'),
            leading: const Icon(Icons.calendar_today),
            onTap: () {
              Navigator.pop(context);
              onCalendarChanged('all_calendar');
            },
          ),
          ListTile(
            title: const Text('로그 아웃'),
            leading: const Icon(Icons.logout),
            onTap: () {
              Get.find<AuthController>().logout();
              Get.offAllNamed('/login');
            },
          ),
        ],
      ),
    );
  }
}

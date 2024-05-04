import 'package:calendar/controllers/calendar_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CustomDrawer extends StatelessWidget {
  final Function(String) onCalendarChanged;

  CustomDrawer({Key? key, required this.onCalendarChanged}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final UserCalendarController calendarController =
        Get.find<UserCalendarController>();

    return Drawer(
      child: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                DrawerHeader(
                  decoration: BoxDecoration(color: Colors.blue),
                  child: Text('캘린더 목록'),
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
            title: const Text('모든 캘린더'),
            leading: const Icon(Icons.calendar_today),
            onTap: () {
              Navigator.pop(context);
              onCalendarChanged('all_calendar');
            },
          ),
        ],
      ),
    );
  }
}

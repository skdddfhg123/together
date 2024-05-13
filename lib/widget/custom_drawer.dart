import 'package:calendar/api/get_calendar_service.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/screens/myprofile_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/widget/calendar_utils.dart';

class CustomDrawer extends StatelessWidget {
  final Function(String) onCalendarChanged;

  const CustomDrawer({
    super.key,
    required this.onCalendarChanged,
  });

  @override
  Widget build(BuildContext context) {
    final calendarController = Get.find<UserCalendarController>();
    final authController = Get.find<AuthController>();
    final calendarApiService = CalendarApiService();
    return Drawer(
      child: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                // DrawerHeader(
                //   decoration: BoxDecoration(
                //     color: Colors.blue[200],
                //   ),
                //   child: Column(
                //     children: [
                //       ListTile(
                //         title: const Text('연동 앱 관리'),
                //         trailing: const Icon(Icons.phone_android), // 아이콘 추가
                //         onTap: () {
                //           Navigator.of(context).pop();
                //           showSyncLoginPageModal(context);
                //         }, // 클릭 이벤트 핸들러
                //       ),
                //       syncButton(),
                //     ],
                //   ),
                // ),
                UserAccountsDrawerHeader(
                  accountName: Text(
                    authController.user?.nickname ?? '반가워요, 사용자님',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  accountEmail: Text(
                    authController.user?.useremail ?? 'email@example.com',
                    style: const TextStyle(
                      color: Colors.black,
                    ),
                  ),
                  currentAccountPicture: CircleAvatar(
                    backgroundImage: NetworkImage(
                        authController.user?.thumbnail ??
                            'https://via.placeholder.com/150'),
                  ),
                  decoration: BoxDecoration(
                    color: Colors.blue[200],
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(
                      child: Column(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.calendar_today, size: 30),
                            onPressed: () {
                              Navigator.pop(context);
                              onCalendarChanged('all_calendar');
                            },
                          ),
                          const Text(
                            '모든 캘린더',
                            style: TextStyle(
                              fontSize: 12,
                            ),
                          )
                        ],
                      ),
                    ),
                    VerticalDivider(
                      thickness: 1,
                      color: Colors.grey[800],
                    ),
                    Expanded(
                      child: Column(
                        children: [
                          IconButton(
                            icon:
                                const Icon(Icons.person_pin_rounded, size: 30),
                            onPressed: () {
                              Navigator.pop(context);
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const MyProfile()),
                              );
                            },
                          ),
                          const Text(
                            '계정 관리',
                            style: TextStyle(
                              fontSize: 12,
                            ),
                          )
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(thickness: 1),
                Obx(
                  () => Column(
                    children: List.generate(calendarController.calendars.length,
                        (index) {
                      final calendar = calendarController.calendars[index];
                      return ListTile(
                        title: Row(
                          children: [
                            if (calendar.coverImage != null)
                              Image.network(
                                calendar.coverImage!,
                                width: 50,
                                height: 50,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Icon(Icons.error),
                              ),
                            const SizedBox(width: 15),
                            Expanded(
                                child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(calendar.title),
                                const SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  '(${calendar.attendees.length}명)',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey,
                                  ),
                                )
                              ],
                            )),
                          ],
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          onCalendarChanged(calendar.calendarId);
                          calendarApiService.loadMemberAppointmentsForCalendar(
                              calendar.calendarId);
                        },
                      );
                    }),
                  ),
                ),
                ListTile(
                  title: Row(
                    children: [
                      Image.network(
                        'https://cdn.pixabay.com/photo/2021/07/25/08/07/add-6491203_640.png',
                        width: 45,
                        height: 45,
                      ),
                      const SizedBox(width: 15),
                      const Expanded(child: Text("새 캘린더 만들기")),
                    ],
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    showAddCalendarDialog(context);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/calendar_controller.dart'; // CalendarController를 가져옵니다.
import 'package:calendar/controllers/metting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/calendar_detail_view.dart';
import 'package:calendar/screens/login_page.dart';
import 'package:calendar/screens/sync_login_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllCalendar extends StatelessWidget {
  AllCalendar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final MeetingController meetingController = Get.put(MeetingController());
    final UserCalendarController calendarController =
        Get.find<UserCalendarController>(); // CalendarController 인스턴스를 생성

    void showAddCalendarDialog() {
      final calendarNameController =
          TextEditingController(); // 캘린더 이름을 입력 받기 위한 컨트롤러

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
                onPressed: () async {
                  await calendarController.addCalendar(
                      calendarNameController.text, "public");
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }

    void _showSyncLoginPageModal(BuildContext context) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ), // 다이얼로그의 모서리를 둥글게
            child: SyncLoginPage(), // SyncLoginPage를 다이얼로그 내용으로 사용
          );
        },
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('All Calendar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: showAddCalendarDialog, // 캘린더 추가 버튼
          ),
        ],
      ),
      drawer: Drawer(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: [
                  DrawerHeader(
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                    ),
                    child: ListTile(
                      title: const Text('연동 앱 관리'),
                      trailing: const Icon(Icons.sync), // 아이콘 추가
                      onTap: () {
                        Navigator.of(context).pop();
                        _showSyncLoginPageModal(context);
                      }, // 클릭 이벤트 핸들러
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
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => CalendarDetailView(
                                      calendarId: calendar.calendarId),
                                ),
                              );
                            },
                          );
                        }),
                      )),
                ],
              ),
            ),
            ListTile(
              title: const Text('모든 캘린더 '), // AllCalendar 페이지로 이동하는 버튼
              leading: const Icon(Icons.calendar_today), // 아이콘 추가
              onTap: () {
                Navigator.pop(context); // Drawer 닫기
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => AllCalendar()), // AllCalendar 페이지로 이동
                );
              },
            ),
            ListTile(
              title: const Text('로그 아웃'), // AllCalendar 페이지로 이동하는 버튼
              leading: const Icon(Icons.logout_outlined), // 아이콘 추가
              onTap: () {
                Get.find<AuthController>().logout();
                Get.offAll(LoginPage());
              },
            ),
          ],
        ),
      ),
      body: GetBuilder<MeetingController>(
        builder: (meetingController) => SfCalendar(
          view: CalendarView.month,
          dataSource: MeetingDataSource(meetingController.getAllAppointments()),
          monthViewSettings: const MonthViewSettings(
            appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
            appointmentDisplayCount: 5,
          ),
        ),
      ),
    );
  }
}

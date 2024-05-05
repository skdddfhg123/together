import 'package:calendar/api/kakao_auth_service.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/calendar_controller.dart'; // CalendarController를 가져옵니다.
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/event_detail.dart';
import 'package:calendar/screens/login_page.dart';
import 'package:calendar/screens/sync_login_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllCalendar extends StatelessWidget {
  final Function(String)? onCalendarChanged;
  DateTime? _lastTappedDate;

  AllCalendar({super.key, this.onCalendarChanged});

  final KakaoAuthService kakaoAuthService = Get.find<KakaoAuthService>();
  final MeetingController meetingController = Get.find<MeetingController>();

  @override
  Widget build(BuildContext context) {
    final UserCalendarController calendarController =
        Get.find<UserCalendarController>(); // CalendarController 인스턴스를 생성
    final eventSelectionController = Get.find<EventSelectionController>();

    void showAddCalendarDialog() {
      final calendarNameController =
          TextEditingController(); // 캘린더 이름을 입력 받기 위한 컨트롤러
      Color pickerColor = Colors.blue; // 기본 색상
      Color currentColor = Colors.blue; // 현재 선택된 색상

      // 색상 선택기 다이얼로그를 보여주는 함수
      void changeColor(Color color) {
        pickerColor = color;
      }

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('캘린더 추가'),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  TextField(
                    controller: calendarNameController,
                    decoration: const InputDecoration(hintText: "캘린더 이름"),
                  ),
                  ListTile(
                    title: const Text("색상 선택"),
                    leading: Icon(Icons.color_lens, color: currentColor),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: const Text("색상 선택"),
                            content: SingleChildScrollView(
                              child: ColorPicker(
                                pickerColor: pickerColor,
                                onColorChanged: changeColor,
                                pickerAreaHeightPercent: 0.8,
                              ),
                            ),
                            actions: <Widget>[
                              TextButton(
                                child: const Text('저장'),
                                onPressed: () {
                                  currentColor = pickerColor;
                                  Navigator.of(context).pop();
                                },
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
            actions: <Widget>[
              TextButton(
                child: const Text('추가'),
                onPressed: () async {
                  await calendarController.addCalendar(
                    calendarNameController.text,
                    currentColor, // 색상 정보 추가
                  );
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
                    child: Column(
                      children: [
                        ListTile(
                          title: const Text('연동 앱 관리'),
                          trailing: const Icon(Icons.phone_android), // 아이콘 추가
                          onTap: () {
                            Navigator.of(context).pop();
                            _showSyncLoginPageModal(context);
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
                              onCalendarChanged?.call(calendar.calendarId);
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
                onCalendarChanged?.call('all_calendar');
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
          ),
          onTap: (CalendarTapDetails details) {
            DateTime selectedDate = details.date!;

            if (eventSelectionController.lastTappedDate.value == selectedDate) {
              eventSelectionController.lastTappedDate.value = null; // 상태 초기화
              showAppointmentsModal(meetingController, selectedDate); // 모달 표시
            } else {
              eventSelectionController.lastTappedDate.value =
                  selectedDate; // 처음 탭한 날짜 저장
            }
          },
        ),
      ),
    );
  }

  Widget syncButton() {
    return ListTile(
      title: const Text('동기화 하기'),
      trailing: const Icon(Icons.sync),
      onTap: () async {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        String? jwtToken = prefs.getString('token');
        String? accessToken = prefs.getString('kakaoAccessToken');
        String? refreshToken = prefs.getString('kakaoRefreshToken');

        if (jwtToken != null && accessToken != null) {
          kakaoAuthService.sendTokensToServer(
              jwtToken, accessToken, refreshToken);
        } else {
          print('No token available for syncing');
        }
      },
    );
  }

  void showCustomModal(BuildContext context, List<Appointment> appointments) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return ListView.builder(
          itemCount: appointments.length,
          itemBuilder: (context, index) {
            final appointment = appointments[index];
            return ListTile(
              title: Text(appointment.subject),
              subtitle:
                  Text('${appointment.startTime} - ${appointment.endTime}'),
              trailing: Container(
                width: 10,
                height: 30,
                color: appointment.color,
              ),
            );
          },
        );
      },
    );
  }

  void showAppointmentsModal(
      MeetingController meetingController, DateTime date) {
    var appointments = meetingController.getAppointmentsForDate(date);
    showModalBottomSheet(
      context: Get.context!,
      isScrollControlled: true,
      useSafeArea: true,
      isDismissible: true,
      builder: (BuildContext context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              width: double.infinity,
              child: Text(
                DateFormat('M월 d일 EEEE', 'ko_KR').format(date),
                style: const TextStyle(color: Colors.black, fontSize: 18),
                textAlign: TextAlign.left,
              ),
            ),
            Expanded(
              child: appointments.isEmpty
                  ? const Center(
                      child: Text(
                        "일정이 없습니다",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  : Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 8),
                      child: ListView.builder(
                        itemCount: appointments.length,
                        itemBuilder: (context, index) {
                          var appointment = appointments[index];
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            child: InkWell(
                              onTap: () {
                                // 상세 정보 표시 로직
                                // 이벤트 상세 페이지로 네비게이션
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => EventDetailPage(
                                      eventTitle:
                                          appointment.appointment.subject,
                                      startTime:
                                          appointment.appointment.startTime,
                                      endTime: appointment.appointment.endTime,
                                      isNotified:
                                          false, // 예시 값, 실제 모델에 따라 수정 필요
                                      calendarColor:
                                          appointment.appointment.color,
                                      userProfileImageUrl:
                                          "https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_640.jpg", // 예시 URL
                                      groupEventId: appointment.groupeventId,
                                    ),
                                  ),
                                );
                              },
                              child: Row(
                                children: <Widget>[
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Text(
                                        DateFormat('a h:mm', 'ko_KR').format(
                                            appointment.appointment.startTime),
                                        style: const TextStyle(fontSize: 14),
                                      ),
                                      Text(
                                        DateFormat('a h:mm', 'ko_KR').format(
                                            appointment.appointment.endTime),
                                        style: const TextStyle(fontSize: 14),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    height: 30,
                                    width: 10,
                                    decoration: BoxDecoration(
                                      color: appointment.appointment.color,
                                      borderRadius: BorderRadius.circular(5),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      appointment.appointment.subject,
                                      style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  const CircleAvatar(
                                    backgroundImage: NetworkImage(
                                        "https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_640.jpg"),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
            ),
          ],
        );
      },
    );
  }
}

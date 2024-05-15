// dialog_service.dart

import 'package:cached_network_image/cached_network_image.dart';
import 'package:calendar/api/event_creates_service.dart';
import 'package:calendar/api/kakao_auth_service.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/screens/sync_login_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class DialogService {
  static void showAddAppointmentDialog(
    BuildContext context,
    DateTime selectedDate,
    Color color,
    String calendarId,
    String title,
  ) {
    final TextEditingController _subjectController = TextEditingController();
    DateTime _selectedStartTime = selectedDate;
    DateTime _selectedEndTime = selectedDate.add(Duration(hours: 1));
    final MeetingController meetingController = Get.find<MeetingController>();
    final UserCalendarController calendarController =
        Get.find<UserCalendarController>();
    final AuthController authController = Get.find<AuthController>();

    List<String> selectedAttendees = [
      authController.user!.useremail
    ]; // 자신의 이메일을 포함

    void _updateDateTime(
        bool isStartTime, DateTime updatedDateTime, StateSetter setState) {
      setState(() {
        if (isStartTime) {
          _selectedStartTime = updatedDateTime;
        } else {
          _selectedEndTime = updatedDateTime;
        }
      });
    }

    Future<void> _pickDateTime(
        BuildContext context, bool isStartTime, StateSetter setState) async {
      final DateTime? pickedDate = await showDatePicker(
        context: context,
        initialDate: isStartTime ? _selectedStartTime : _selectedEndTime,
        firstDate: DateTime(2000),
        lastDate: DateTime(2100),
      );

      if (pickedDate != null) {
        final TimeOfDay? pickedTime = await showTimePicker(
          context: context,
          initialTime: TimeOfDay.fromDateTime(
              isStartTime ? _selectedStartTime : _selectedEndTime),
        );

        if (pickedTime != null) {
          final updatedDateTime = DateTime(
            pickedDate.year,
            pickedDate.month,
            pickedDate.day,
            pickedTime.hour,
            pickedTime.minute,
          );
          _updateDateTime(isStartTime, updatedDateTime, setState);
        }
      }
    }

    void _showAttendeeSelectionDialog(StateSetter parentSetState) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return Dialog(
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.8,
                  height: MediaQuery.of(context).size.height * 0.6,
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        '참여자 선택',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: ListView.builder(
                          itemCount: calendarController.calendars
                              .firstWhere((cal) => cal.calendarId == calendarId)
                              .attendees
                              .length,
                          itemBuilder: (context, index) {
                            var member = calendarController.calendars
                                .firstWhere(
                                    (cal) => cal.calendarId == calendarId)
                                .attendees[index];
                            return CheckboxListTile(
                              title: Row(
                                children: [
                                  CircleAvatar(
                                    backgroundImage: CachedNetworkImageProvider(
                                        member.thumbnail ?? ''),
                                    radius: 18,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(member.nickname),
                                ],
                              ),
                              value:
                                  selectedAttendees.contains(member.useremail),
                              onChanged: (bool? value) {
                                setState(() {
                                  if (value == true) {
                                    selectedAttendees.add(member.useremail);
                                  } else {
                                    selectedAttendees.remove(member.useremail);
                                  }
                                });
                                parentSetState(() {}); // 부모 다이얼로그 상태 업데이트
                              },
                            );
                          },
                        ),
                      ),
                      ElevatedButton(
                        child: const Text('완료'),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      );
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Dialog(
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: Container(
                width: MediaQuery.of(context).size.width * 0.9,
                height: MediaQuery.of(context).size.height * 0.8,
                padding: const EdgeInsets.all(16.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const Text(
                        '일정 추가하기',
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _subjectController,
                        decoration: const InputDecoration(
                          labelText: "제목",
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ListTile(
                        leading: Icon(Icons.timer_outlined, color: color),
                        title: const Text("시작 날짜 및 시간"),
                        subtitle: Text(
                            DateFormat('yyyy년 M월 dd일 (E)     a H:mm', 'ko_KR')
                                .format(_selectedStartTime)),
                        onTap: () => _pickDateTime(context, true, setState),
                      ),
                      ListTile(
                        leading: Icon(Icons.timer_off_outlined, color: color),
                        title: const Text("종료 날짜 및 시간"),
                        subtitle: Text(
                            DateFormat('yyyy년 M월 dd일 (E)     a H:mm', 'ko_KR')
                                .format(_selectedEndTime)),
                        onTap: () => _pickDateTime(context, false, setState),
                      ),
                      const SizedBox(height: 16),
                      ListTile(
                        leading: Icon(Icons.calendar_today, color: color),
                        title: const Text("선택된 캘린더"),
                        subtitle: Text(title),
                      ),
                      const SizedBox(height: 16),
                      ListTile(
                        leading: Icon(Icons.group, color: color),
                        title: const Text("멤버 선택"),
                        subtitle: selectedAttendees.isEmpty
                            ? const Text("참여할 멤버를 선택하세요")
                            : Column(
                                children: selectedAttendees.map((email) {
                                  var attendee = calendarController.calendars
                                      .expand((cal) => cal.attendees)
                                      .firstWhere(
                                          (member) => member.useremail == email,
                                          orElse: () => null!);
                                  if (attendee != null) {
                                    return Row(
                                      children: [
                                        CircleAvatar(
                                          backgroundImage:
                                              CachedNetworkImageProvider(
                                                  attendee.thumbnail ?? ''),
                                          radius: 12,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(attendee.nickname),
                                      ],
                                    );
                                  } else {
                                    return Container();
                                  }
                                }).toList(),
                              ),
                        onTap: () => _showAttendeeSelectionDialog(setState),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: <Widget>[
                          TextButton(
                            child: const Text('취소'),
                            onPressed: () {
                              Navigator.pop(context);
                            },
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            child: const Text('추가'),
                            onPressed: () async {
                              SharedPreferences prefs =
                                  await SharedPreferences.getInstance();
                              String? token = prefs.getString('token');

                              // 백엔드에 일정 추가 요청
                              var result =
                                  await CalendarEventService().createEvent(
                                _subjectController.text,
                                _selectedStartTime,
                                _selectedEndTime,
                                calendarId,
                                token!,
                                color,
                                [...selectedAttendees],
                              );

                              if (result['isCreated']) {
                                String groupEventId = result['groupEventId'];
                                Appointment newAppointment = Appointment(
                                  startTime: _selectedStartTime,
                                  endTime: _selectedEndTime,
                                  subject: _subjectController.text,
                                  color: color,
                                  id: calendarId.toString(),
                                );
                                meetingController.addCalendarAppointment(
                                  newAppointment,
                                  calendarId,
                                  groupEventId,
                                  false,
                                  authController.user?.useremail,
                                  authController.user?.nickname,
                                  authController.user?.thumbnail,
                                  [...selectedAttendees],
                                  [],
                                );
                                Navigator.pop(context);
                              } else {
                                Get.snackbar("일정 등록 실패", "잠시 후 다시 시도 해주세요.");
                              }
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}

//////////////////////////////////////// 동기화 페이지 /////////////////////////////////////////
void showSyncLoginPageModal(BuildContext context) {
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

///////////////////////// 동기화 버튼 ///////////////////////////////////////////////
Widget syncButton() {
  final KakaoAuthService kakaoAuthService = Get.find<KakaoAuthService>();
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

///////////////////////////////////////캘린더 추가하기 ////////////////////////////////////////

void showAddCalendarDialog(BuildContext context) {
  final UserCalendarController calendarController =
      Get.find<UserCalendarController>();
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

import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/chat_page.dart';
import 'package:calendar/widget/custom_drawer.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import '../models/calendar.dart';

class CalendarDetailView extends StatelessWidget {
  final String calendarId;
  final Function(String) onCalendarChanged; // 페이지 변경을 위한 콜백

  const CalendarDetailView(
      {super.key, required this.calendarId, required this.onCalendarChanged});

  @override
  Widget build(BuildContext context) {
    final calendarController = Get.find<UserCalendarController>();
    final meetingController = Get.find<MeetingController>();

    Calendar? selectedCalendar = calendarController.calendars.firstWhere(
      (cal) => cal.calendarId == calendarId,
    );

    void _onCalendarTapped(CalendarTapDetails details) {
      if (details.targetElement == CalendarElement.calendarCell ||
          details.targetElement == CalendarElement.appointment) {
        final DateTime selectedDate = details.date!;
        final EventSelectionController eventController =
            Get.find<EventSelectionController>();
        eventController.saveSelection(calendarId, selectedDate);
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(selectedCalendar.title),
        actions: [
          IconButton(
            onPressed: () async {
              bool confirmDelete = await showDialog<bool>(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: const Text("캘린더 삭제"),
                        content: const Text(
                            "캘린더를 삭제 하면 캘린더의 일정이 모두 다 삭제 됩니다. 삭제 하시겠습니까?"),
                        actions: <Widget>[
                          TextButton(
                            child: const Text("취소"),
                            onPressed: () => Navigator.of(context).pop(false),
                          ),
                          TextButton(
                            child: const Text("삭제"),
                            onPressed: () => Navigator.of(context).pop(true),
                          ),
                        ],
                      );
                    },
                  ) ??
                  false;

              if (confirmDelete) {
                await meetingController
                    .deleteCalendarAndAppointments(calendarId);
                onCalendarChanged('all_calendar'); // All Calendar 페이지로 리디렉션
              }
            },
            icon: const Icon(Icons.delete_forever_rounded),
          ),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChatPage(
                      calendarId: selectedCalendar.calendarId,
                      calendartitle: selectedCalendar.title),
                ),
              );
            },
            icon: const Icon(Icons.chat),
          ),
        ],
      ),
      drawer: CustomDrawer(onCalendarChanged: (id) => onCalendarChanged(id)),
      body: Obx(() {
        // MeetingController에서 변경 사항을 감지하여 UI를 갱신합니다.
        final dataSource = MeetingDataSource(
          calendarAppointments:
              meetingController.getAppointmentsForCalendar(calendarId),
          memberAppointments: meetingController.getMemberAppointments(),
        );

        // 이미 처리된 닉네임을 추적하는 맵
        final Map<DateTime, Set<String>> processedNicknames = {};

        return SfCalendar(
          view: CalendarView.month,
          firstDayOfWeek: 7,
          monthViewSettings: const MonthViewSettings(
            appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
          ),
          dataSource: dataSource, // 여기서 dataSource를 설정
          appointmentBuilder:
              (BuildContext context, CalendarAppointmentDetails details) {
            final appointment = details.appointments.first;
            final isMember = dataSource.isMemberAppointment(appointment);
            final memberInfo = dataSource.getMemberInfo(appointment);

            // 해당 날짜에 이미 처리된 닉네임을 확인하고 추가
            final appointmentDate = DateTime(appointment.startTime.year,
                appointment.startTime.month, appointment.startTime.day);
            if (!processedNicknames.containsKey(appointmentDate)) {
              processedNicknames[appointmentDate] = {};
            }

            if (isMember) {
              final nickname = memberInfo!.nickname;
              if (processedNicknames[appointmentDate]!.contains(nickname)) {
                // 이미 처리된 닉네임인 경우 빈 컨테이너 반환
                return Container();
              } else {
                // 새로운 닉네임인 경우 처리하고 닉네임을 추가
                processedNicknames[appointmentDate]!.add(nickname);

                // 처리된 닉네임의 개수에 따라 위치를 조정하기 위해 인덱스를 계산
                final index = processedNicknames[appointmentDate]!.length - 1;
                final leftOffset = index * 20.0;

                return Stack(
                  children: [
                    Positioned(
                      right: leftOffset,
                      top: 5,
                      child: Container(
                        width: details.bounds.width / 2,
                        height: details.bounds.height / 2,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          shape: BoxShape.circle,
                          image: DecorationImage(
                            image: NetworkImage(memberInfo.thumbnail),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              }
            } else {
              return Container(
                decoration: BoxDecoration(
                  color: selectedCalendar.color,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Column(
                  children: [
                    Expanded(
                      child: Text(
                        appointment.subject,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }
          },
          onTap: _onCalendarTapped,
        );
      }),
    );
  }
}

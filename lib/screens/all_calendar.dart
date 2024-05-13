import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/models/userinfo.dart';
import 'package:calendar/screens/event_detail.dart';

import 'package:calendar/widget/custom_drawer.dart';
import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:intl/intl.dart';

import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllCalendar extends StatelessWidget {
  final Function(String)? onCalendarChanged;

  AllCalendar({super.key, this.onCalendarChanged});

  final MeetingController meetingController = Get.find<MeetingController>();

  @override
  Widget build(BuildContext context) {
    final eventSelectionController = Get.find<EventSelectionController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('모든 캘린더'),
      ),
      drawer:
          CustomDrawer(onCalendarChanged: (id) => onCalendarChanged?.call(id)),
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
              showAppointmentsModal(
                  context, meetingController, selectedDate); // 모달 표시
            } else {
              eventSelectionController.lastTappedDate.value =
                  selectedDate; // 처음 탭한 날짜 저장
            }
          },
        ),
      ),
    );
  }

  void showAppointmentsModal(BuildContext context,
      MeetingController meetingController, DateTime date) {
    var appointments = meetingController.getAppointmentsForDate(date);
    final AuthController authController = Get.find<AuthController>();

    showModalBottomSheet(
      context: context, // Use passed context here for reliable Get.find usage
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
                                // Navigate to event detail page
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
                                          false, // Update based on your model
                                      calendarColor:
                                          appointment.appointment.color,
                                      userProfileImageUrl:
                                          authController.user?.thumbnail ?? '',
                                      groupEventId: appointment.groupEventId,
                                    ),
                                  ),
                                );
                              },
                              child: buildAppointmentRow(
                                  context, appointment, authController),
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

  Widget buildAppointmentRow(BuildContext context,
      CalendarAppointment appointment, AuthController authController) {
    return Row(
      children: <Widget>[
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              DateFormat('a h:mm', 'ko_KR')
                  .format(appointment.appointment.startTime),
              style: const TextStyle(fontSize: 14),
            ),
            Text(
              DateFormat('a h:mm', 'ko_KR')
                  .format(appointment.appointment.endTime),
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
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        CircleAvatar(
          backgroundImage: NetworkImage(authController.user?.thumbnail ?? ''),
        ),
      ],
    );
  }
}

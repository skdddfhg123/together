import 'package:cached_network_image/cached_network_image.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/meeting_data.dart';
import 'package:calendar/screens/chat_page.dart';
import 'package:calendar/widget/custom_drawer.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:month_year_picker/month_year_picker.dart';
import '../models/calendar.dart';

class CalendarDetailView extends StatefulWidget {
  final String calendarId;
  final Function(String) onCalendarChanged; // 페이지 변경을 위한 콜백

  const CalendarDetailView(
      {super.key, required this.calendarId, required this.onCalendarChanged});

  @override
  _CalendarDetailViewState createState() => _CalendarDetailViewState();
}

class _CalendarDetailViewState extends State<CalendarDetailView> {
  late String appBarTitle;
  DateTime selectedDate = DateTime.now();
  final CalendarController _calendarController = CalendarController();

  @override
  void initState() {
    super.initState();
    appBarTitle = formatDate(selectedDate);
  }

  String formatDate(DateTime date) {
    return '${date.year}년${date.month}월';
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showMonthYearPicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      builder: (context, child) {
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Container(
                height: 520,
                child: child,
              ),
            ),
          ],
        );
      },
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        appBarTitle = formatDate(selectedDate);
        _calendarController.displayDate = selectedDate;
        if (selectedDate.month != DateTime.now().month) {
          _calendarController.selectedDate = selectedDate;
        } else {
          _calendarController.selectedDate = DateTime.now();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final calendarController = Get.find<UserCalendarController>();
    final meetingController = Get.find<MeetingController>();

    Calendar? selectedCalendar = calendarController.calendars.firstWhere(
      (cal) => cal.calendarId == widget.calendarId,
    );

    void _onCalendarTapped(CalendarTapDetails details) {
      if (details.targetElement == CalendarElement.calendarCell ||
          details.targetElement == CalendarElement.appointment) {
        final DateTime selectedDate = details.date!;
        final EventSelectionController eventController =
            Get.find<EventSelectionController>();
        eventController.saveSelection(widget.calendarId, selectedDate);
        setState(() {
          this.selectedDate = selectedDate;
          appBarTitle = formatDate(selectedDate);
        });
      }
    }

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color.fromRGBO(253, 252, 255, 1),
          leadingWidth: 30, // leadingWidth 조정
          title: Row(
            children: [
              Expanded(
                child: TextButton(
                  onPressed: () => _selectDate(context),
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero, // 패딩을 0으로 설정
                    alignment: Alignment.centerLeft, // 텍스트 버튼의 정렬을 왼쪽으로 설정
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Stack(
                            alignment: Alignment.center,
                            children: [
                              Text(
                                appBarTitle,
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  foreground: Paint()
                                    ..style = PaintingStyle.stroke
                                    ..strokeWidth = 2
                                    ..color = Colors.white,
                                ),
                              ),
                              Text(
                                appBarTitle,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                          const Padding(
                            padding: EdgeInsets.only(top: 2.5),
                            child: Icon(
                              Icons.calendar_month,
                              color: Color.fromARGB(255, 163, 161, 161),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '${selectedCalendar.title} (${selectedCalendar.attendees.length}명)',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.normal,
                          color: Color.fromARGB(255, 114, 113, 113),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          actions: [
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
        drawer: CustomDrawer(
            onCalendarChanged: (id) => widget.onCalendarChanged(id)),
        body: Obx(() {
          final dataSource = MeetingDataSource(
            calendarAppointments:
                meetingController.getAppointmentsForCalendar(widget.calendarId),
            memberAppointments: meetingController.getMemberAppointments(),
          );

          return SfCalendar(
            view: CalendarView.month,
            controller: _calendarController,
            dataSource: dataSource,
            monthViewSettings: const MonthViewSettings(
              appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
            ),
            headerHeight: 0,
            onTap: _onCalendarTapped,
            selectionDecoration: BoxDecoration(
              color: Colors.transparent,
              border: Border.all(
                color: Colors.transparent,
                width: 0,
              ),
            ),
            onViewChanged: (ViewChangedDetails details) {
              DateTime firstDateOfMonth = details.visibleDates.firstWhere(
                  (date) => date.day == 1,
                  orElse: () => details.visibleDates.first);

              DateTime now = DateTime.now();
              DateTime today = DateTime(now.year, now.month, now.day);
              bool isCurrentMonth = firstDateOfMonth.year == now.year &&
                  firstDateOfMonth.month == now.month;

              WidgetsBinding.instance.addPostFrameCallback((_) {
                if (!mounted) return;
                setState(() {
                  if (isCurrentMonth) {
                    appBarTitle = formatDate(today); // 오늘 날짜로 설정
                  } else {
                    appBarTitle = formatDate(firstDateOfMonth); // 해당 달의 첫 날로 설정
                  }
                  if (isCurrentMonth) {
                    if (_calendarController.selectedDate != today) {
                      _calendarController.selectedDate = today;
                      _calendarController.displayDate = today;
                    }
                  } else {
                    if (_calendarController.selectedDate != firstDateOfMonth) {
                      _calendarController.selectedDate = firstDateOfMonth;
                      _calendarController.displayDate = firstDateOfMonth;
                    }
                  }
                });
              });

              // 추가: 멤버 일정 로드 함수 호출
              // meetingController
              //     .loadMemberAppointmentsForCalendar(widget.calendarId);
            },
            initialSelectedDate: DateTime.now(),
            monthCellBuilder: (context, details) {
              TextStyle textStyle = const TextStyle(
                  color: Colors.black,
                  fontSize: 11,
                  fontWeight: FontWeight.bold);

              Color cellColor = Colors.transparent;

              if (details.date.year == _calendarController.selectedDate!.year &&
                  details.date.month ==
                      _calendarController.selectedDate!.month &&
                  details.date.day == _calendarController.selectedDate!.day) {
                cellColor = const Color.fromARGB(50, 158, 158, 158);
              }

              if (details.date.year == selectedDate.year &&
                  details.date.month == selectedDate.month &&
                  details.date.day == selectedDate.day) {
                cellColor = Colors.grey.shade300; // 선택된 날짜의 배경을 회색으로 설정
              }

              DateTime now = DateTime.now();
              bool isToday = now.year == details.date.year &&
                  now.month == details.date.month &&
                  now.day == details.date.day;

              if (isToday) {
                textStyle = textStyle.copyWith(
                    color: Colors.white, fontWeight: FontWeight.bold);
              }

              bool isCurrentMonth = details.date.month ==
                  details.visibleDates[details.visibleDates.length ~/ 2].month;
              if (details.date.weekday == DateTime.sunday) {
                if (!isToday)
                  textStyle = textStyle.copyWith(
                      color: Colors.red, fontWeight: FontWeight.bold);
              } else if (details.date.weekday == DateTime.saturday) {
                if (!isToday)
                  textStyle = textStyle.copyWith(
                      color: Colors.blue, fontWeight: FontWeight.bold);
              }

              double opacity = isCurrentMonth ? 1.0 : 0.4;
              textStyle = textStyle.copyWith(
                  color: textStyle.color!.withOpacity(opacity));

              final appointmentDate = DateTime(
                  details.date.year, details.date.month, details.date.day);

              final Set<MemberAppointment> uniqueMembers = {};
              for (var member in dataSource.memberAppointments) {
                if (member.appointments.any((appt) =>
                    appt.startTime.year == appointmentDate.year &&
                    appt.startTime.month == appointmentDate.month &&
                    appt.startTime.day == appointmentDate.day)) {
                  uniqueMembers.add(member);
                }
              }

              return Container(
                alignment: Alignment.topLeft,
                padding: const EdgeInsets.only(left: 2),
                decoration: BoxDecoration(
                  color: cellColor,
                  border: const Border(
                    top: BorderSide(
                      color: Color.fromARGB(50, 158, 158, 158),
                      width: 1,
                    ),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (isToday)
                      Container(
                        width: 23,
                        height: 23,
                        alignment: Alignment.center,
                        decoration: const BoxDecoration(
                          color: Color.fromARGB(255, 0, 0, 0),
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          details.date.day.toString(),
                          style: textStyle.copyWith(color: Colors.white),
                        ),
                      )
                    else
                      Text(
                        details.date.day.toString(),
                        style: textStyle,
                      ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Wrap(
                        spacing: 2,
                        runSpacing: 2,
                        children: uniqueMembers
                            .map((member) => CircleAvatar(
                                  radius: 6,
                                  backgroundImage: CachedNetworkImageProvider(
                                      member.thumbnail),
                                ))
                            .toList(),
                      ),
                    ),
                  ],
                ),
              );
            },
            appointmentBuilder:
                (BuildContext context, CalendarAppointmentDetails details) {
              final appointment = details.appointments.first;

              // 멤버 일정인지 확인
              final isMemberAppointment =
                  dataSource.isMemberAppointment(appointment);

              // 멤버 일정이 아닌 경우에만 표시
              if (!isMemberAppointment) {
                return Container(
                  decoration: BoxDecoration(
                    color: appointment.color,
                    borderRadius: BorderRadius.circular(2),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(2, 5, 0, 0),
                    child: Column(
                      children: [
                        Expanded(
                          child: Text(
                            appointment.subject,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              overflow: TextOverflow.clip,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }

              // 멤버 일정인 경우 빈 컨테이너 반환
              return Container();
            },
          );
        }),
      ),
    );
  }
}

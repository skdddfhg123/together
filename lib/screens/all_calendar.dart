import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/all_data.dart';
import 'package:calendar/screens/event_detail.dart';
import 'package:calendar/widget/custom_drawer.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:month_year_picker/month_year_picker.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllCalendar extends StatefulWidget {
  final Function(String)? onCalendarChanged;

  AllCalendar({super.key, this.onCalendarChanged});

  @override
  _AllCalendarState createState() => _AllCalendarState();
}

class _AllCalendarState extends State<AllCalendar> {
  DateTime selectedDate = DateTime.now();
  final CalendarController _calendarController = CalendarController();
  final UserCalendarController userCalendarController =
      Get.find<UserCalendarController>();
  late String appBarTitle;

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
    final eventSelectionController = Get.find<EventSelectionController>();

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color.fromARGB(255, 168, 200, 226),
          leading: Builder(
            builder: (BuildContext context) {
              return IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () {
                  Scaffold.of(context).openDrawer();
                },
              );
            },
          ),
          leadingWidth: 30, // leading 아이콘의 넓이를 조정하여 여백을 줄입니다.
          title: Row(
            children: [
              Expanded(
                child: TextButton(
                  onPressed: () => _selectDate(context),
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero, // 패딩을 0으로 설정하여 텍스트 버튼을 왼쪽으로 붙입니다.
                    alignment: Alignment.centerLeft, // 텍스트 버튼의 정렬을 왼쪽으로 설정합니다.
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
                                  fontSize: 16,
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
                                  fontSize: 16,
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
                              color: Color.fromARGB(255, 193, 193, 193),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '모든 캘린더 (${userCalendarController.calendars.length})',
                        style: const TextStyle(
                          fontSize: 10,
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
        ),
        drawer: CustomDrawer(
            onCalendarChanged: (id) => widget.onCalendarChanged?.call(id)),
        body: GetBuilder<MeetingController>(
          builder: (meetingController) => SfCalendar(
            view: CalendarView.month,
            controller: _calendarController,
            dataSource: AllDataSource(meetingController.getAllAppointments()),
            monthViewSettings: const MonthViewSettings(
              appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
            ),
            headerHeight: 0, // 헤더 높이를 0으로 설정하여 헤더를 숨깁니다.
            onTap: (CalendarTapDetails details) {
              DateTime tappedDate = details.date!;

              if (eventSelectionController.lastTappedDate.value == tappedDate) {
                eventSelectionController.lastTappedDate.value = null; // 상태 초기화
                showAppointmentsModal(
                    context, meetingController, tappedDate); // 모달 표시
              } else {
                eventSelectionController.lastTappedDate.value =
                    tappedDate; // 처음 탭한 날짜 저장
              }

              setState(() {
                selectedDate = tappedDate;
                appBarTitle = formatDate(tappedDate);
              });
            },
            selectionDecoration: BoxDecoration(
              color: Colors.transparent,
              border: Border.all(
                color: Colors.transparent,
                width: 0,
              ),
            ), // 선택한 날짜의 테두리를 없앱니다.
            monthCellBuilder: (BuildContext context, MonthCellDetails details) {
              TextStyle textStyle = const TextStyle(
                  color: Colors.black,
                  fontSize: 11,
                  fontWeight: FontWeight.bold);

              Color cellColor = Colors.transparent;

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

              double opacity = isCurrentMonth ? 1.0 : 0.5;
              textStyle = textStyle.copyWith(
                  color: textStyle.color!.withOpacity(opacity));

              return Container(
                alignment: Alignment.topCenter,
                decoration: BoxDecoration(
                  color: cellColor,
                  border: const Border(
                    top: BorderSide(
                      color: Color.fromARGB(50, 158, 158, 158),
                      width: 1,
                    ),
                  ),
                ),
                child: Stack(
                  alignment: Alignment.topCenter,
                  children: [
                    if (isToday)
                      Container(
                        width: 23,
                        height: 23,
                        decoration: const BoxDecoration(
                          color: Color.fromARGB(255, 0, 0, 0),
                          shape: BoxShape.circle,
                        ),
                      ),
                    Container(
                      height: 21.5,
                      alignment: Alignment.center,
                      child: Text(
                        details.date.day.toString(),
                        style: textStyle,
                      ),
                    ),
                  ],
                ),
              );
            },
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
            },
          ),
        ),
      ),
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///

  void showAppointmentsModal(BuildContext context,
      MeetingController meetingController, DateTime date) {
    var appointments = meetingController.getAppointmentsForDateSplit(date);
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
                                          appointment.authorThumbnail ?? '',
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
          backgroundImage: NetworkImage(appointment.authorThumbnail ?? ''),
        ),
      ],
    );
  }
}

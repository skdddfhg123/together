import 'package:calendar/screens/calendar_setting.dart';
import 'package:calendar/screens/myprofile_page.dart';
import 'package:calendar/widget/calendar_utils.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/controllers/event_selection.dart';
import 'package:calendar/screens/alarm.dart';
import 'package:calendar/screens/memo.dart';
import 'package:calendar/widget/custom_bottom_navbar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'calendar_detail_view.dart';
import 'all_calendar.dart';

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);

  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _selectedIndex = 0;
  late List<Widget> _pages;
  String calendarId = 'all_calendar'; // 초기 값 설정

  @override
  void initState() {
    super.initState();
    _pages = [
      AllCalendar(onCalendarChanged: _changePage),
      const MemoPage(),
      const MemoPage(),
      const NotificationPage(),
      CalendarSettingsPage(calendarId: calendarId),
    ];
  }

  void _changePage(String newCalendarId) {
    setState(() {
      calendarId = newCalendarId;
      if (calendarId == null) {
        calendarId = 'all_calendar';
      }

      if (newCalendarId == 'all_calendar') {
        _pages[0] = AllCalendar(onCalendarChanged: _changePage);
        _pages[4] = const MyProfile(); // "설정" 탭을 MyProfilePage로 변경
      } else {
        _pages[0] = CalendarDetailView(
            calendarId: newCalendarId, onCalendarChanged: _changePage);
        _pages[4] = CalendarSettingsPage(
            calendarId: calendarId); // 해당 calendarId의 설정 페이지로 이동
      }
      _selectedIndex = 0; // 일정 탭으로 돌아가기
    });
  }

  void _onItemTapped(int index) {
    if (index == 2) {
      // '작성' 탭
      final EventSelectionController eventController =
          Get.find<EventSelectionController>();
      if (eventController.selectedDate.value != null) {
        final selectedDate = eventController.selectedDate.value!;

        _showCalendarSelectionDialog(context, (calendarId) {
          final UserCalendarController calendarController =
              Get.find<UserCalendarController>();
          final selectedCalendar = calendarController.calendars.firstWhere(
            (cal) => cal.calendarId == calendarId,
          );

          print(selectedCalendar.title);

          if (selectedCalendar != null) {
            DialogService.showAddAppointmentDialog(
              context,
              selectedDate,
              selectedCalendar.color,
              calendarId,
              selectedCalendar.title,
            );
          } else {
            ScaffoldMessenger.of(context)
                .showSnackBar(const SnackBar(content: Text("선택된 캘린더가 없습니다.")));
          }
        });
      } else {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text("일정을 선택 하세요")));
      }
    } else {
      setState(() {
        _selectedIndex = index; // 다른 탭을 선택했을 때만 인덱스 변경
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: CustomBottomNavBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  void _showCalendarSelectionDialog(
      BuildContext context, Function(String) onCalendarSelected) {
    final UserCalendarController calendarController =
        Get.find<UserCalendarController>();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0),
          ),
          child: Container(
            width: MediaQuery.of(context).size.width * 0.85,
            height: MediaQuery.of(context).size.height * 0.7,
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  '캘린더 선택',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView.builder(
                    itemCount: calendarController.calendars.length,
                    itemBuilder: (context, index) {
                      var calendar = calendarController.calendars[index];
                      return InkWell(
                        onTap: () {
                          Navigator.of(context).pop();
                          onCalendarSelected(calendar.calendarId);
                        },
                        child: Card(
                          margin: const EdgeInsets.symmetric(vertical: 8.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          elevation: 4,
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Row(
                              children: [
                                Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8.0),
                                    image: DecorationImage(
                                      image: NetworkImage(
                                          calendar.coverImage ?? ''),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        calendar.title,
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      SizedBox(
                                        height:
                                            50, // Increased height for the list of attendees
                                        child: ListView.builder(
                                          scrollDirection: Axis.horizontal,
                                          itemCount: calendar.attendees.length,
                                          itemBuilder:
                                              (context, attendeeIndex) {
                                            var attendee = calendar
                                                .attendees[attendeeIndex];
                                            return Padding(
                                              padding: const EdgeInsets.only(
                                                  right: 8.0),
                                              child: Column(
                                                children: [
                                                  const SizedBox(height: 10),
                                                  CircleAvatar(
                                                    backgroundImage:
                                                        NetworkImage(attendee
                                                                .thumbnail ??
                                                            ''),
                                                    radius: 12,
                                                  ),
                                                  Text(
                                                    attendee.nickname,
                                                    style: const TextStyle(
                                                        fontSize: 10),
                                                  ),
                                                ],
                                              ),
                                            );
                                          },
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(
                                  Icons.arrow_forward_ios,
                                  size: 16,
                                  color: Colors.grey,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

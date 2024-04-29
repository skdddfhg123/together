import 'package:app_cal/widget/drawer.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:month_year_picker/month_year_picker.dart';

class AllCalendar extends StatefulWidget {
  static final GlobalKey<_AllCalendarState> calendarKey =
      GlobalKey<_AllCalendarState>();
  AllCalendar({super.key});

  @override
  State<AllCalendar> createState() => _AllCalendarState();
}

class _AllCalendarState extends State<AllCalendar> {
  String appBarTitle = 'Calendar';
  DateTime selectedDate = DateTime.now();
  final CalendarController _calendarController = CalendarController();

  @override
  void initState() {
    super.initState();
    appBarTitle = formatDate(selectedDate);
  }

  void moveToToday() {
    DateTime today = DateTime.now();
    setState(() {
      selectedDate = today;
      appBarTitle = formatDate(selectedDate);
      _calendarController.displayDate = selectedDate;
    });
  }

  String formatDate(DateTime date) {
    return '${date.year}년 ${date.month}월';
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
      setState(
        () {
          selectedDate = picked;
          appBarTitle = formatDate(selectedDate);
          _calendarController.displayDate = selectedDate;
          if (selectedDate.month != DateTime.now().month) {
            _calendarController.selectedDate = selectedDate;
          } else {
            _calendarController.selectedDate = DateTime.now();
          }
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextButton(
          onPressed: () => _selectDate(context),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                alignment: Alignment.center,
                children: [
                  // 윤곽선을 그리는 텍스트
                  Text(
                    appBarTitle,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      foreground: Paint()
                        ..style = PaintingStyle.stroke
                        ..strokeWidth = 3
                        ..color = Colors.white, // 윤곽선의 색상
                    ),
                  ),
                  // 실제 텍스트
                  Text(
                    appBarTitle,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black, // 텍스트의 색상
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
        ),
        actions: [
          IconButton(
              onPressed: () {},
              icon: const Icon(
                Icons.search,
                color: Colors.white,
              )),
          IconButton(
              onPressed: () {},
              icon: const Icon(
                Icons.chat,
                color: Colors.white,
              )),
        ],
        flexibleSpace: Opacity(
          opacity: 1,
          child: Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/test.gif'),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
      ),
      drawer: const CustomDrawer(),
      body: SfCalendar(
        view: CalendarView.month,
        headerHeight: 0,
        onTap: (CalendarTapDetails details) {
          setState(() {
            DateTime date = details.date!;
            _calendarController.selectedDate =
                DateTime(date.year, date.month, date.day);
          });
        },
        controller: _calendarController,
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

          // 현재 시간과 월의 첫 날짜를 비교
          DateTime now = DateTime.now();
          DateTime today = DateTime(now.year, now.month, now.day);
          bool isCurrentMonth = firstDateOfMonth.year == now.year &&
              firstDateOfMonth.month == now.month;

          // 프레임 빌드 후에 캘린더 컨트롤러를 업데이트합니다.
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (!mounted) return;
            setState(() {
              appBarTitle = formatDate(firstDateOfMonth);
              if (isCurrentMonth) {
                // 현재 월일 경우 오늘 날짜를 선택
                if (_calendarController.selectedDate != today) {
                  _calendarController.selectedDate = today;
                  _calendarController.displayDate = today;
                }
              } else {
                // 다른 월일 경우 월의 첫 날짜를 선택
                if (_calendarController.selectedDate != firstDateOfMonth) {
                  _calendarController.selectedDate = firstDateOfMonth;
                  _calendarController.displayDate = firstDateOfMonth;
                }
              }
            });
          });
        },
        initialSelectedDate: DateTime.now(),
        monthCellBuilder: (context, details) {
          // 평일 날짜 기본 컬러 블랙
          TextStyle textStyle = const TextStyle(
            color: Colors.black,
            fontSize: 11,
          );

          // 달력 셀의 기본 스타일 설정
          Color cellColor = Colors.transparent;

          // 선택된 날짜인 경우 배경색 변경
          if (details.date.year == _calendarController.selectedDate!.year &&
              details.date.month == _calendarController.selectedDate!.month &&
              details.date.day == _calendarController.selectedDate!.day) {
            cellColor =
                const Color.fromARGB(50, 158, 158, 158); // 선택된 전체 셀에 회색 배경 적용
          }

          // 오늘 날짜인 경우
          DateTime now = DateTime.now();
          bool isToday = now.year == details.date.year &&
              now.month == details.date.month &&
              now.day == details.date.day;

          if (isToday) {
            textStyle = textStyle.copyWith(
                color: Colors.white); // 오늘 날짜의 숫자 색상을 흰색으로 변경
          }

          // 달력 뷰의 중간 날짜를 사용하여 현재 보고 있는 월을 결정
          bool isCurrentMonth = details.date.month ==
              details.visibleDates[details.visibleDates.length ~/ 2].month;
          if (details.date.weekday == 7) {
            // 일요일
            if (!isToday) textStyle = textStyle.copyWith(color: Colors.red);
          } else if (details.date.weekday == 6) {
            // 토요일
            if (!isToday) textStyle = textStyle.copyWith(color: Colors.blue);
          }

          // 현재 월에 해당하지 않는 날짜에 대해 투명도 조절
          double opacity = isCurrentMonth ? 1.0 : 0.5;
          textStyle =
              textStyle.copyWith(color: textStyle.color!.withOpacity(opacity));

          return Container(
            alignment: Alignment.topCenter,
            decoration: BoxDecoration(
              color: cellColor, // 셀 배경색 설정
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
                if (isToday) // 오늘 날짜에 색이 채워진 동그라미를 그립니다.
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
      ),
    );
  }
}

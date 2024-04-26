import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllCalendar extends StatefulWidget {
  const AllCalendar({super.key});

  @override
  State<AllCalendar> createState() => _AllCalendarState();
}

class _AllCalendarState extends State<AllCalendar> {
  String appBarTitle = 'Calendar';
  DateTime selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    // 초기 날짜를 현재 날짜로 설정합니다.
    appBarTitle = formatDate(DateTime.now());
  }

  String formatDate(DateTime date) {
    return '${date.year}년 ${date.month}월';
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        appBarTitle = formatDate(selectedDate);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextButton(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                appBarTitle,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Icon(
                Icons.calendar_month,
                color: Colors.black,
              ),
            ],
          ),
          onPressed: () => _selectDate(context),
        ),
      ),
      drawer: const Drawer(),
      body: SfCalendar(
        view: CalendarView.month,
        headerHeight: 0,
        onViewChanged: (ViewChangedDetails details) {
          DateTime midDate =
              details.visibleDates[details.visibleDates.length ~/ 2];
          // 프레임 빌드 후에 제목을 업데이트
          WidgetsBinding.instance.addPostFrameCallback((_) {
            setState(() {
              appBarTitle = formatDate(midDate);
            });
          });
        },
        headerDateFormat: 'y년 M월',
        initialSelectedDate: DateTime.now(),
        showDatePickerButton: true,
        monthCellBuilder: (context, details) {
          // 달력 뷰의 중간 날짜를 사용하여 현재 보고 있는 월을 결정
          bool isCurrentMonth = details.date.month ==
              details.visibleDates[details.visibleDates.length ~/ 2].month;

          // 평일 날짜 기본컬러 블랙
          TextStyle textStyle = const TextStyle(color: Colors.black);

          if (details.date.weekday == 7) {
            // 일요일
            textStyle = const TextStyle(color: Colors.red);
          } else if (details.date.weekday == 6) {
            // 토요일
            textStyle = const TextStyle(color: Colors.blue);
          }

          // 현재 월에 해당하지 않는 날짜에 대해 투명도 조절
          double opacity = isCurrentMonth ? 1.0 : 0.5;
          textStyle =
              textStyle.copyWith(color: textStyle.color!.withOpacity(opacity));

          return Container(
            alignment: Alignment.topCenter,
            child: Text(
              details.date.day.toString(),
              style: textStyle,
            ),
          );
        },
      ),
    );
  }
}

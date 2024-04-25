import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AllCalendar extends StatefulWidget {
  const AllCalendar({super.key});

  @override
  State<AllCalendar> createState() => _AllCalendarState();
}

class _AllCalendarState extends State<AllCalendar> {
  @override
  Widget build(BuildContext context) {
    return SfCalendar(
      view: CalendarView.month,
      cellBorderColor: Colors.white,

      // monthCellBuilder: (context, details) {
      //   bool isSunday = details.date.weekday == 7;
      //   Color textColor = isSunday ? Colors.red : Colors.black;
      //   return Container(
      //     child: Text(
      //       details.date.day.toString(),
      //       style: TextStyle(color: textColor),
      //     ),
      //   );
      // },
    );
  }
}

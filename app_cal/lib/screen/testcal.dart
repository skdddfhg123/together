import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class TestCal extends StatefulWidget {
  const TestCal({super.key});

  @override
  State<TestCal> createState() => _TestCalState();
}

class _TestCalState extends State<TestCal> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SfCalendar(
        view: CalendarView.month,
      ),
    );
  }
}

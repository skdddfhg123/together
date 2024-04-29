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
      appBar: AppBar(
        actions: [
          IconButton(
              onPressed: () {},
              icon: const Icon(
                Icons.search,
              )),
          IconButton(
              onPressed: () {},
              icon: const Icon(
                Icons.chat,
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
      drawer: Drawer(),
      body: SfCalendar(
        view: CalendarView.month,
      ),
    );
  }
}

import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart'; // 날짜 형식을 위해 필요

class EventDetailPage extends StatefulWidget {
  final String eventTitle;
  final DateTime startTime;
  final DateTime endTime;
  final bool isNotified;
  final Color calendarColor;
  final String userProfileImageUrl;
  final String groupEventId;

  const EventDetailPage({
    super.key,
    required this.eventTitle,
    required this.startTime,
    required this.endTime,
    required this.isNotified,
    required this.calendarColor,
    required this.userProfileImageUrl,
    required this.groupEventId,
  });

  @override
  _EventDetailPageState createState() => _EventDetailPageState();
}

class _EventDetailPageState extends State<EventDetailPage> {
  @override
  Widget build(BuildContext context) {
    final MeetingController meetingController = Get.find<MeetingController>();
    // 날짜와 시간 포맷 설정
    final DateFormat dateFormat = DateFormat('yyyy. M. d (E)', 'ko_KR');
    final DateFormat timeFormat = DateFormat('a h:mm', 'ko_KR');

    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: widget.calendarColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: CircleAvatar(
          backgroundImage: NetworkImage(widget.userProfileImageUrl),
        ),
        actions: <Widget>[
          PopupMenuButton<String>(
            icon: Icon(Icons.more_vert, color: widget.calendarColor),
            onSelected: (value) {
              if (value == 'edit') {
                // Implement your edit action
              } else if (value == 'delete') {
                // 삭제 확인 다이얼로그 표시
                showDialog(
                  context: context,
                  builder: (BuildContext dialogContext) {
                    return AlertDialog(
                      title: const Text("삭제 확인"),
                      content: const Text("정말 삭제하시겠습니까?"),
                      actions: <Widget>[
                        TextButton(
                          child: const Text("취소"),
                          onPressed: () {
                            Navigator.of(dialogContext).pop(); // 다이얼로그 닫기
                          },
                        ),
                        TextButton(
                          child: const Text("삭제"),
                          onPressed: () {
                            // 실제 삭제 로직 실행
                            meetingController
                                .deleteCalendarAppointment(widget.groupEventId)
                                .then((_) {
                              Navigator.of(dialogContext).pop(); // 다이얼로그 닫기
                              Navigator.of(context).pop(); // 이벤트 상세 페이지 닫기
                            });
                          },
                        ),
                      ],
                    );
                  },
                );
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'edit',
                child: Text('편집'),
              ),
              const PopupMenuItem<String>(
                value: 'delete',
                child: Text('삭제'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Center(
              child: Text(
                widget.eventTitle,
                style: TextStyle(
                  color: widget.calendarColor,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(dateFormat.format(widget.startTime),
                      style: const TextStyle(
                        fontSize: 16,
                      )),
                  Text(
                    timeFormat.format(widget.startTime),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: Icon(Icons.arrow_right_sharp,
                    size: 35, color: widget.calendarColor),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    dateFormat.format(widget.endTime),
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    timeFormat.format(widget.endTime),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const Divider(
            color: Color.fromARGB(255, 226, 225, 225),
            thickness: 1,
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Icon(
                  Icons.alarm_sharp,
                  color: widget.calendarColor,
                  size: 32,
                ),
                const SizedBox(width: 8),
                Text(
                  widget.isNotified ? "Disabled" : "알림 없음",
                  style: const TextStyle(
                    fontSize: 20,
                  ),
                ),
              ],
            ),
          ),
          const Divider(
            color: Color.fromARGB(255, 226, 225, 225),
            thickness: 1,
          ),
          Expanded(
            child: ListView.builder(
              itemCount: 20, // Example count for user posts
              itemBuilder: (_, index) => ListTile(
                title: Text(
                  'Post $index',
                ),
                subtitle: Text('Detail of post $index'),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Implement your add post action
        },
        backgroundColor: widget.calendarColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

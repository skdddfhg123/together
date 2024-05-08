import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/screens/create_post_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart'; // 날짜 형식을 위해 필요
import 'package:cached_network_image/cached_network_image.dart';

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
  int currentPage = 0;
  // 현재 시간으로부터 몇 시간 전인지를 계산하는 함수
  String timeAgoSinceDate(DateTime date) {
    final currentDate = DateTime.now();
    final difference = currentDate.difference(date);

    if (difference.inDays > 30) {
      return '${difference.inDays ~/ 30}달 전';
    } else if (difference.inDays > 7) {
      return '${difference.inDays ~/ 7}주 전';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}일 전';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}시간 전';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}분 전';
    } else {
      return '방금 전';
    }
  }

  @override
  void initState() {
    super.initState();
    final MeetingController meetingController = Get.find<MeetingController>();
    meetingController.loadFeedsForEvent(widget.groupEventId);
  }

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
            child: Obx(
              () {
                // groupEventId가 현재 페이지의 groupEventId와 일치하는 피드만 필터링
                List<FeedWithId> filteredFeeds = meetingController.feeds
                    .where((feedWithId) =>
                        feedWithId.groupeventId == widget.groupEventId)
                    .toList();

                if (filteredFeeds.isNotEmpty) {
                  return ListView.builder(
                    itemCount: filteredFeeds.length,
                    itemBuilder: (_, index) {
                      final feedWithId = filteredFeeds[index];
                      final feed = feedWithId.feed;
                      final feedId = feedWithId.feedId; // 피드의 ID를 추출
                      return Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border(
                            bottom:
                                BorderSide(color: Colors.grey[300]!, width: 1),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundImage:
                                          NetworkImage(feed.thumbnail),
                                      radius: 20,
                                    ),
                                    const SizedBox(width: 10),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          feed.nickname,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Text(
                                          timeAgoSinceDate(feed.createdAt),
                                          style: TextStyle(
                                            color: Colors.grey[600],
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                PopupMenuButton<String>(
                                  icon: Icon(Icons.more_vert,
                                      color: widget.calendarColor),
                                  onSelected: (String value) {
                                    switch (value) {
                                      case 'edit':
                                        // 편집 기능을 여기에 구현
                                        break;
                                      case 'delete':
                                        showDialog(
                                          context: context,
                                          builder:
                                              (BuildContext dialogContext) {
                                            return AlertDialog(
                                              title: const Text("삭제 확인"),
                                              content: const Text(
                                                  "이 게시물을 삭제하시겠습니까?"),
                                              actions: <Widget>[
                                                TextButton(
                                                  child: const Text("취소"),
                                                  onPressed: () => Navigator.of(
                                                          dialogContext)
                                                      .pop(),
                                                ),
                                                TextButton(
                                                  child: const Text("삭제"),
                                                  onPressed: () {
                                                    // 삭제 로직 구현
                                                    meetingController
                                                        .deleteFeed(feedId)
                                                        .then((_) {
                                                      Navigator.of(
                                                              dialogContext)
                                                          .pop();
                                                    });
                                                  },
                                                ),
                                              ],
                                            );
                                          },
                                        );
                                        break;
                                    }
                                  },
                                  itemBuilder: (BuildContext context) =>
                                      <PopupMenuEntry<String>>[
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
                            const SizedBox(height: 10),
                            // Container(
                            //   alignment: Alignment.bottomRight,
                            //   padding: const EdgeInsets.symmetric(vertical: 8),
                            //   child: Text(
                            //     '${currentPage + 1}/${feed.imageSrcs.length}',
                            //     style: TextStyle(color: Colors.grey[700]),
                            //   ),
                            // ),
                            if (feed.imageSrcs.isNotEmpty)
                              Container(
                                height: 200,
                                child: PageView.builder(
                                  itemCount: feed.imageSrcs.length,
                                  onPageChanged: (int page) {
                                    setState(() {
                                      currentPage = page;
                                    });
                                  },
                                  itemBuilder: (_, imageIndex) {
                                    return ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        feed.imageSrcs[imageIndex],
                                        fit: BoxFit.cover,
                                        loadingBuilder: (BuildContext context,
                                            Widget child,
                                            ImageChunkEvent? loadingProgress) {
                                          if (loadingProgress == null) {
                                            return child;
                                          }
                                          return Center(
                                            child: CircularProgressIndicator(
                                              value: loadingProgress
                                                          .expectedTotalBytes !=
                                                      null
                                                  ? loadingProgress
                                                          .cumulativeBytesLoaded /
                                                      loadingProgress
                                                          .expectedTotalBytes!
                                                  : null,
                                            ),
                                          );
                                        },
                                      ),
                                    );
                                  },
                                ),
                              ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.mode_comment_outlined,
                                      color: Colors.black),
                                  onPressed: () {
                                    // 댓글 기능 구현
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.bookmark_add_outlined,
                                      color: Colors.black),
                                  onPressed: () {
                                    // 북마크 기능 구현
                                  },
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                Text(
                                  feed.nickname,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  feed.content,
                                  style: const TextStyle(
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  );
                } else {
                  return const Center(
                    child: Text("아직 게시글이 없습니다."),
                  );
                }
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context).push(MaterialPageRoute(
            builder: (context) =>
                CreateFeedPage(groupEventId: widget.groupEventId),
          ));
        },
        backgroundColor: widget.calendarColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

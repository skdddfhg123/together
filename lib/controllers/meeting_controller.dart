import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:calendar/api/calendar_delete_service.dart';
import 'package:calendar/api/comment_service.dart';
import 'package:calendar/api/delete_event_service.dart';
import 'package:calendar/api/event_creates_service.dart';
import 'package:calendar/api/post_service.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/calendar_controller.dart';
import 'package:calendar/models/comment.dart';
import 'package:calendar/models/post.dart';
import 'package:calendar/models/social_event.dart';
import 'package:calendar/screens/event_detail.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;
import 'dart:math';

class CalendarAppointment {
  final Appointment appointment;
  final String calendarId;
  final String groupEventId;
  final bool isSocial;
  final String authorEmail;
  final String authorNickname;
  final String? authorThumbnail;

  CalendarAppointment({
    required this.appointment,
    required this.calendarId,
    required this.groupEventId,
    required this.isSocial,
    required this.authorEmail,
    required this.authorNickname,
    this.authorThumbnail,
  });
}

class MemberAppointment {
  final String useremail;
  final String nickname;
  final String thumbnail;
  final List<Appointment> appointments;

  MemberAppointment({
    required this.useremail,
    required this.nickname,
    required this.appointments,
    required this.thumbnail,
  });

  // JSON에서 MemberAppointment 객체로 변환
  factory MemberAppointment.fromJson(Map<String, dynamic> json) {
    List<Appointment> appointments = [];
    Color memberColor =
        Colors.primaries[Random().nextInt(Colors.primaries.length)];

    for (var event in json['allevents']) {
      DateTime startAtUtc = DateTime.parse(event['startAt']);
      DateTime endAtUtc = DateTime.parse(event['endAt']);
      DateTime startAtSeoul = startAtUtc.add(Duration(hours: 9));
      DateTime endAtSeoul = endAtUtc.add(Duration(hours: 9));

      DateTime currentStart = startAtSeoul;
      while (currentStart.isBefore(endAtSeoul)) {
        DateTime endOfDay = DateTime(
          currentStart.year,
          currentStart.month,
          currentStart.day,
          23,
          59,
          59,
        );

        DateTime currentEnd =
            endAtSeoul.isBefore(endOfDay) ? endAtSeoul : endOfDay;

        appointments.add(Appointment(
          startTime: currentStart,
          endTime: currentEnd,
          subject: event['title'],
          color: memberColor,
        ));

        currentStart = currentEnd.add(Duration(seconds: 1));
      }
    }

    return MemberAppointment(
      thumbnail: json['thumbnail'] ??
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4yBIuo_Fy_zUopbWqlVpxfAVZKUQk-EUqmE0Fxt8sQ&s',
      useremail: json['useremail'],
      nickname: json['nickname'],
      appointments: appointments,
    );
  }
}

class FeedWithId {
  final Feed feed;
  final String groupeventId;
  final String feedId;

  FeedWithId({
    required this.feed,
    required this.groupeventId,
    required this.feedId,
  });

  factory FeedWithId.fromJson(Map<String, dynamic> json, String groupeventId) {
    return FeedWithId(
      feed: Feed.fromJsonLoad(json), // json 객체 자체를 Feed.fromJson에 전달
      groupeventId: groupeventId,
      feedId: json['feedId'] as String,
    );
  }
}

class CommentWithFeedId {
  final Comment comment;
  final String feedId;

  CommentWithFeedId({
    required this.comment,
    required this.feedId,
  });
}

class MeetingController extends GetxController {
  final RxList<CalendarAppointment> calendarAppointments =
      <CalendarAppointment>[].obs;

  final RxList<MemberAppointment> memberAppointments =
      <MemberAppointment>[].obs;

  final DeleteEventService deleteEventService = DeleteEventService();
  final CalendarEventService eventService = CalendarEventService();
  final DeleteCalendarService deleteCalendarService = DeleteCalendarService();

/////////////////////////////////////멤 버 일 정 ////////////////////////////////////
  final RxMap<DateTime, Set<String>> processedNicknames =
      <DateTime, Set<String>>{}.obs;

  final AuthController authController = Get.find<AuthController>();

  MemberAppointment? getMemberInfoForNickname(String nickname) {
    return memberAppointments.firstWhere(
        (member) => member.nickname == nickname,
        orElse: () => null!);
  }

  Future<void> loadMemberAppointmentsForCalendar(String calendarId) async {
    String? token = await _loadToken();
    final String url =
        "http://15.164.174.224:3000/auth/all/getcalendar/V2/$calendarId";

    memberAppointments.clear();

    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        List<dynamic> responseData = json.decode(response.body);
        for (var memberData in responseData) {
          MemberAppointment memberAppointment =
              MemberAppointment.fromJson(memberData);
          memberAppointments.add(memberAppointment); // 멤버 일정 리스트에 추가
        }
        update();
      } else {
        print('Failed to load member appointments: ${response.body}');
      }
    } catch (e) {
      print('Error fetching member appointments: $e');
    }
  }

  Future<String?> _loadToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token')?.trim();
  }

//////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////피드 부분 /////////////////////////////////////////
  final FeedService feedService = FeedService();
  final RxList<FeedWithId> feeds = <FeedWithId>[].obs;

  void addFeed(Feed newFeed, String groupEventId, String feedId) {
    var newFeeds = FeedWithId(
      feed: newFeed,
      groupeventId: groupEventId,
      feedId: feedId,
    );
    feeds.add(newFeeds);
    update(); // Trigger UI updates where MeetingController is being used
  }

  // 특정 이벤트와 관련된 모든 피드를 삭제하는 메소드
  Future<void> deleteFeedsForEvent(String groupEventId) async {
    List<FeedWithId> feedsToDelete =
        feeds.where((feed) => feed.groupeventId == groupEventId).toList();
    for (FeedWithId feed in feedsToDelete) {
      await deleteFeed(feed.feedId);
    }
  }

  // 피드를 삭제하는 메소드
  Future<void> deleteFeed(String feedId) async {
    bool isDeleted = await feedService.deleteFeed(feedId);
    if (isDeleted) {
      feeds.removeWhere((feed) => feed.feedId == feedId); // 로컬 리스트에서 피드 삭제
      update(); // GetX의 상태를 업데이트하여 UI를 갱신
      Get.snackbar('삭제 성공', '피드가 성공적으로 삭제 되었습니다.');
    } else {
      Get.snackbar('삭제 실패', '피드 삭제에 실패 하였습니다.');
    }
  }

  void loadFeedsForEvent(String groupEventId) async {
    try {
      var eventFeeds = await feedService.loadFeedsForGroup(groupEventId);
      if (eventFeeds.isNotEmpty) {
        feeds.assignAll(eventFeeds);
        update(); // 상태 업데이트 강제 실행
        print("success");
      } else {
        print("No feeds found for this groupEventId: $groupEventId");
      }
    } catch (e) {
      print("Failed to load feeds: $e");
    }
  }
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////// 댓 글 ///////////////////////////////////////////////
  final CommentService commentService = CommentService();
  final RxList<CommentWithFeedId> comments = <CommentWithFeedId>[].obs;

  // 특정 피드에 대한 댓글 로드 메서드
  Future<void> loadCommentsForFeed(String feedId) async {
    try {
      comments.clear(); // 기존 댓글 목록을 초기화
      var feedComments = await commentService.fetchComments(feedId);
      var mappedComments = feedComments
          .map((comment) => CommentWithFeedId(comment: comment, feedId: feedId))
          .toList();
      comments.assignAll(mappedComments);
      update(); // 리스너에게 업데이트 알림
    } catch (e) {
      print('댓글 로딩 에러: $e');
      Get.snackbar('오류', '댓글을 로드하는데 실패했습니다.');
    }
  }

  // 특정 피드에 댓글을 게시하는 메서드
  Future<void> addComment(
      String feedId, String content, String nickname, String thumbnail) async {
    try {
      Comment? newComment = await commentService.postComment(
          feedId, content, nickname, thumbnail);
      if (newComment != null) {
        comments.add(CommentWithFeedId(comment: newComment, feedId: feedId));
        update(); // 새 댓글 추가 후 UI 업데이트
        Get.snackbar('성공', '댓글이 성공적으로 추가되었습니다.');
      }
    } catch (e) {
      print('댓글 게시 에러: $e');
      Get.snackbar('오류', '댓글 게시에 실패했습니다.');
    }
  }

//////////////////////////////////////////멤 버 일 정 /////////////////////////////////////////
  void printMemberAppointments() {
    for (var memberAppointment in memberAppointments) {
      print(memberAppointment.nickname);
    }
  }

//////////////////////////////////////// 캘린더, 일정 부분 //////////////////////////////////////

  void addCalendarAppointment(
    Appointment appointment,
    String calendarId,
    String groupeventId,
    bool isSocial,
    String? useremail,
    String? nickname,
    String? thumbnail,
  ) {
    var newCalendarAppointment = CalendarAppointment(
        appointment: appointment,
        calendarId: calendarId,
        groupEventId: groupeventId,
        isSocial: isSocial,
        authorEmail: useremail!,
        authorNickname: nickname!,
        authorThumbnail: thumbnail);
    calendarAppointments.add(newCalendarAppointment);
    loadMemberAppointmentsForCalendar(calendarId);
    update();
  }

  Future<void> getKakaoEvents() async {
    String? token = await _loadToken();
    final String apiUrl = "http://15.164.174.224:3000/kakao/get/social";
    tz.initializeTimeZones(); // 시간대 데이터 초기화
    var seoul = tz.getLocation('Asia/Seoul'); // 서울 시간대 객체 가져오기

    try {
      final response = await http.get(
        Uri.parse(apiUrl),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);

        for (var event in data) {
          final DateTime startTimeUtc = DateTime.parse(event['startAt']);
          final DateTime endTimeUtc = DateTime.parse(event['endAt']);
          final startTimeSeoul = tz.TZDateTime.from(startTimeUtc, seoul);
          final endTimeSeoul = tz.TZDateTime.from(endTimeUtc, seoul);

          addCalendarAppointment(
            Appointment(
              startTime: startTimeSeoul,
              endTime: endTimeSeoul,
              subject: event['title'] ?? 'KaKao',
              color: const Color.fromARGB(249, 249, 224, 0),
              isAllDay: false,
            ),
            'usercalendarId',
            event['socialEventId'],
            true,
            authController.user?.useremail,
            authController.user?.nickname,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrnkGghQpkEKOXPtDt1jMo5qFoCHkBbUe9Ew&usqp=CAU',
          );
        }
        update();
      } else {
        print('Failed to load member appointments: ${response.body}');
      }
    } catch (e) {
      print('Error fetching member appointments: $e');
    }
  }

  void syncSocialEvents(List<dynamic> jsonData) {
    tz.initializeTimeZones(); // 시간대 데이터 초기화
    var seoul = tz.getLocation('Asia/Seoul'); // 서울 시간대 객체 가져오기
    // calendarAppointments에서 isSocial이 true인 항목 제거
    calendarAppointments.removeWhere((appointment) => appointment.isSocial);

    List<SocialEvent> events =
        jsonData.map((data) => SocialEvent.fromJson(data)).toList();

    Set<String> newEventCalendarIds =
        events.map((event) => event.userCalendarId).toSet();

    calendarAppointments.removeWhere(
        (appointment) => newEventCalendarIds.contains(appointment.calendarId));

    update();

    for (var event in events) {
      // UTC 시간을 서울 시간대로 변환
      DateTime startTimeSeoul = tz.TZDateTime.from(event.startAt, seoul);
      DateTime endTimeSeoul = tz.TZDateTime.from(event.endAt, seoul);
      addCalendarAppointment(
        Appointment(
          startTime: startTimeSeoul,
          endTime: endTimeSeoul,
          subject: event.title ?? 'KaKao',
          color: const Color.fromARGB(249, 249, 224, 0),
          isAllDay: false,
        ),
        event.userCalendarId,
        event.socialEventId,
        true,
        authController.user?.useremail,
        authController.user?.nickname,
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrnkGghQpkEKOXPtDt1jMo5qFoCHkBbUe9Ew&usqp=CAU',
      );
    }
  }

  List<CalendarAppointment> getAppointmentsForCalendar(String calendarId) {
    return calendarAppointments
        .where((calendarAppointment) =>
            calendarAppointment.calendarId == calendarId)
        .toList();
  }

  List<MemberAppointment> getMemberAppointments() {
    return memberAppointments.toList();
  }

  List<CalendarAppointment> getAllAppointments() {
    // 현재 사용자가 생성한 일정만 필터링
    return calendarAppointments.toList();
    // .where((appointment) => appointment.authorEmail == currentUserEmail)
    // .toList();
  }

  List<CalendarAppointment> getAppointmentsForCalendarAndDate(
      String calendarId, DateTime date) {
    return calendarAppointments
        .where((appointment) =>
            appointment.calendarId == calendarId &&
            appointment.appointment.startTime.day == date.day &&
            appointment.appointment.startTime.month == date.month &&
            appointment.appointment.startTime.year == date.year)
        .toList();
  }

  List<MemberAppointment> getMemberAppointmentsForCalendarAndDate(
      DateTime date) {
    return memberAppointments.where((memberAppointment) {
      return memberAppointment.appointments.any((appointment) {
        return appointment.startTime.day == date.day &&
            appointment.startTime.month == date.month &&
            appointment.startTime.year == date.year;
      });
    }).toList();
  }

  // 특정 캘린더 ID와 일치하는 일정을 모두 삭제하는 메서드
  Future<void> deleteAppointmentsForCalendar(String calendarId) async {
    calendarAppointments
        .removeWhere((appointment) => appointment.calendarId == calendarId);
  }

  // 특정 날짜에 해당하는 모든 일정을 가져오는 메소드
  List<CalendarAppointment> getAppointmentsForDate(DateTime date) {
    return calendarAppointments.where((calendarAppointment) {
      return calendarAppointment.appointment.startTime.day == date.day &&
          calendarAppointment.appointment.startTime.month == date.month &&
          calendarAppointment.appointment.startTime.year == date.year;
    }).toList();
  }

  // 일정과 연관된 피드들을 모두 삭제하는 기능이 포함된 일정 삭제 메소드
  Future<void> deleteCalendarAppointment(String groupEventId) async {
    bool isDeleted = await deleteEventService.deleteEvent(groupEventId);
    if (isDeleted) {
      int index = calendarAppointments
          .indexWhere((item) => item.groupEventId == groupEventId);
      if (index != -1) {
        final calendarId = calendarAppointments[index].calendarId;
        calendarAppointments.removeAt(index);
        await deleteFeedsForEvent(groupEventId); // 연관된 피드들도 삭제
        await loadMemberAppointmentsForCalendar(calendarId);
        update(); // UI 갱신
        Get.back(); // 현재 페이지 닫기
        Get.snackbar('일정 삭제', '해당 일정에 관련된 피드가 함께 삭제 되었습니다.');
      }
    } else {
      Get.snackbar('삭제 실패', '잠시 후 다시 시도 해주세요.',
          snackPosition: SnackPosition.BOTTOM);
    }
  }

  // 캘린더와 해당 일정들을 삭제하는 메서드
  Future<void> deleteCalendarAndAppointments(String calendarId) async {
    bool isDeleted = await deleteCalendarService.deleteCalendar(calendarId);
    if (isDeleted) {
      Get.find<UserCalendarController>().removeCalendar(calendarId);
      // 로컬 상태에서 해당 캘린더의 일정들을 제거
      calendarAppointments
          .removeWhere((appointment) => appointment.calendarId == calendarId);
      update(); // UI 갱신
      Get.back(); // 현재 페이지 닫기
      Get.snackbar('캘린더 삭제 성공', '캘린더와 해당 캘린더의 일정이 모두 삭제 되었습니다.');
    } else {
      Get.snackbar('캘린더 삭제 실패', '캘린더 삭제에 실패 했습니다, 잠시 후 다시 시도해주세요.');
    }
  }

  // 일정 데이터를 초기화하는 메소드
  void clearAppointments() {
    calendarAppointments.clear();
    update(); // UI 갱신을 위해 GetX 상태를 업데이트합니다.
  }

//////////////////////////////////////////일정 모달//////////////////////////////////////////////////////

  List<CalendarAppointment> getAppointmentsForDateSplit(DateTime date) {
    List<CalendarAppointment> splitAppointments = [];
    DateTime startOfDay = DateTime(date.year, date.month, date.day, 0, 0, 0);
    DateTime endOfDay = DateTime(date.year, date.month, date.day, 23, 59, 59);

    for (var appointment in calendarAppointments) {
      DateTime start = appointment.appointment.startTime;
      DateTime end = appointment.appointment.endTime;

      // Ensure that appointments starting and ending on the same day are handled correctly
      if ((start.isBefore(endOfDay.add(Duration(seconds: 1))) &&
              end.isAfter(startOfDay.subtract(Duration(seconds: 1)))) &&
          !(start.isAtSameMomentAs(end) && start.isBefore(startOfDay))) {
        splitAppointments.add(appointment);
      }
    }

    return splitAppointments;
  }

  List<CalendarAppointment> getAppointmentsForCalendarAndDateSplit(
      String calendarId, DateTime date) {
    List<CalendarAppointment> splitAppointments = [];
    DateTime startOfDay = DateTime(date.year, date.month, date.day, 0, 0, 0);
    DateTime endOfDay = DateTime(date.year, date.month, date.day, 23, 59, 59);

    for (var appointment
        in calendarAppointments.where((a) => a.calendarId == calendarId)) {
      DateTime start = appointment.appointment.startTime;
      DateTime end = appointment.appointment.endTime;

      // Ensure that appointments starting and ending on the same day are handled correctly
      if ((start.isBefore(endOfDay.add(Duration(seconds: 1))) &&
              end.isAfter(startOfDay.subtract(Duration(seconds: 1)))) &&
          !(start.isAtSameMomentAs(end) && start.isBefore(startOfDay))) {
        splitAppointments.add(appointment);
      }
    }

    return splitAppointments;
  }

  void showAppointmentsModal(String calendarId, DateTime date) {
    var appointments = getAppointmentsForCalendarAndDateSplit(calendarId, date);
    var memberAppointments = getMemberAppointmentsForCalendarAndDate(date);

    var resources = _getResources(memberAppointments);
    var memberAppointmentsDataSource =
        _getMemberCalendarDataSource(memberAppointments);

    showModalBottomSheet(
      context: Get.context!,
      isScrollControlled: true,
      useSafeArea: true,
      isDismissible: true,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                  width: double.infinity,
                  child: Text(
                    DateFormat('M월 d일 EEEE', 'ko_KR').format(date),
                    style: const TextStyle(color: Colors.black, fontSize: 18),
                    textAlign: TextAlign.left,
                  ),
                ),
                const SizedBox(height: 5),
                if (memberAppointments.isNotEmpty)
                  Container(
                    height: 80.0 + resources.length * 80.0,
                    child: SfCalendar(
                      view: CalendarView.timelineDay,
                      headerHeight: 0,
                      initialDisplayDate: date,
                      timeSlotViewSettings: TimeSlotViewSettings(
                        timeInterval: const Duration(hours: 1),
                        timeIntervalWidth: 50,
                        timelineAppointmentHeight: 60,
                        timeFormat: 'HH:mm',
                        timeTextStyle: const TextStyle(
                          fontSize: 12,
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                        ),
                        timeRulerSize: 30,
                        dateFormat: '',
                        dayFormat: '',
                        allDayPanelColor: Colors.grey[200],
                      ),
                      dataSource: _MemberAppointmentDataSource(
                          memberAppointmentsDataSource, resources),
                      resourceViewSettings: ResourceViewSettings(
                        visibleResourceCount: resources.length,
                        size: 60,
                        displayNameTextStyle: const TextStyle(
                          fontSize: 12,
                          color: Colors.black,
                        ),
                      ),
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
                                padding:
                                    const EdgeInsets.symmetric(vertical: 4),
                                child: InkWell(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => EventDetailPage(
                                          eventTitle:
                                              appointment.appointment.subject,
                                          startTime:
                                              appointment.appointment.startTime,
                                          endTime:
                                              appointment.appointment.endTime,
                                          isNotified:
                                              false, // 예시 값, 실제 모델에 따라 수정 필요
                                          calendarColor:
                                              appointment.appointment.color,
                                          userProfileImageUrl:
                                              appointment.authorThumbnail ?? '',
                                          groupEventId:
                                              appointment.groupEventId,
                                        ),
                                      ),
                                    );
                                  },
                                  child: Row(
                                    children: <Widget>[
                                      Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            DateFormat('a h:mm', 'ko_KR')
                                                .format(appointment
                                                    .appointment.startTime),
                                            style:
                                                const TextStyle(fontSize: 14),
                                          ),
                                          Text(
                                            DateFormat('a h:mm', 'ko_KR')
                                                .format(appointment
                                                    .appointment.endTime),
                                            style:
                                                const TextStyle(fontSize: 14),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(width: 8),
                                      Container(
                                        height: 30,
                                        width: 10,
                                        decoration: BoxDecoration(
                                          color: appointment.appointment.color,
                                          borderRadius:
                                              BorderRadius.circular(5),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          appointment.appointment.subject,
                                          style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      CircleAvatar(
                                        backgroundImage: NetworkImage(
                                            appointment.authorThumbnail ?? ''),
                                      ),
                                    ],
                                  ),
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
      },
    );
  }
}

class _MemberAppointmentDataSource extends CalendarDataSource {
  _MemberAppointmentDataSource(
      List<Appointment> source, List<CalendarResource> resources) {
    appointments = source;
    this.resources = resources;
  }
}

List<Appointment> _getMemberCalendarDataSource(
    List<MemberAppointment> memberAppointments) {
  List<Appointment> appointments = <Appointment>[];
  for (var member in memberAppointments) {
    for (var appointment in member.appointments) {
      appointments.add(Appointment(
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        subject: '${member.nickname}님의 일정',
        color: appointment.color,
        resourceIds: [member.useremail],
      ));
    }
  }
  return appointments;
}

List<CalendarResource> _getResources(
    List<MemberAppointment> memberAppointments) {
  List<CalendarResource> resources = <CalendarResource>[];
  for (var member in memberAppointments) {
    resources.add(CalendarResource(
      id: member.useremail,
      displayName: member.nickname,
      image: NetworkImage(member.thumbnail),
      color: member.appointments.first.color, // 임의의 색상 지정
    ));
  }
  return resources;
}

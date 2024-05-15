import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';
import 'package:uuid/uuid.dart';

class CalendarSettingsPage extends StatelessWidget {
  final String calendarId;

  CalendarSettingsPage({super.key, required this.calendarId});

  Future<void> shareViaKakao(String calendarId) async {
    int templateId = 107902;
    String url = "http://15.164.174.224:3005/invite?invite=$calendarId";

    bool isKakaoTalkSharingAvailable =
        await ShareClient.instance.isKakaoTalkSharingAvailable();

    if (isKakaoTalkSharingAvailable) {
      try {
        Uri uri = await ShareClient.instance
            .shareScrap(url: url, templateId: templateId);
        await ShareClient.instance.launchKakaoTalk(uri);
        print('카카오톡 공유 완료');
      } catch (error) {
        print('카카오톡 공유 실패: $error');
      }
    } else {
      try {
        Uri shareUrl = await WebSharerClient.instance.makeScrapUrl(
            url: url,
            templateId: templateId,
            templateArgs: {'calendarId': '$calendarId'});
        print('${url}, ${templateId}');
        print(shareUrl);
        await launchBrowserTab(shareUrl, popupOpen: true);
      } catch (error) {
        print('카카오톡 공유 실패 $error');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final MeetingController meetingController = Get.find<MeetingController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('설정'),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Display the list of members
            Text('멤버 리스트',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            Obx(() {
              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: meetingController.memberAppointments.map((member) {
                  return Column(
                    children: [
                      CircleAvatar(
                        backgroundImage: NetworkImage(member.thumbnail),
                        radius: 30,
                      ),
                      SizedBox(height: 5),
                      Text(member.nickname, style: TextStyle(fontSize: 14)),
                    ],
                  );
                }).toList(),
              );
            }),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                await shareViaKakao(calendarId);
              },
              style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 41, 89, 161),
                  foregroundColor: const Color.fromARGB(255, 255, 255, 255)),
              child: const Text('멤버 초대하기'),
            ),
            const SizedBox(height: 20),
            // Display calendar info
            ListTile(
              title: const Text('배너 이미지', style: TextStyle(fontSize: 16)),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to calendar info page
              },
            ),
            ListTile(
              title: const Text('커버 이미지', style: TextStyle(fontSize: 16)),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to cover image page
              },
            ),
            ListTile(
              title: const Text('캘린더 삭제', style: TextStyle(fontSize: 16)),
              trailing: const Icon(Icons.delete_forever_sharp),
              onTap: () async {
                bool confirmDelete = await showDialog<bool>(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text("캘린더 삭제"),
                          content: const Text(
                              "캘린더를 삭제 하면 캘린더의 일정이 모두 다 삭제 됩니다. 삭제 하시겠습니까?"),
                          actions: <Widget>[
                            TextButton(
                              child: const Text("취소"),
                              onPressed: () => Navigator.of(context).pop(false),
                            ),
                            TextButton(
                              child: const Text("삭제"),
                              onPressed: () => Navigator.of(context).pop(true),
                            ),
                          ],
                        );
                      },
                    ) ??
                    false;

                if (confirmDelete) {
                  await meetingController
                      .deleteCalendarAndAppointments(calendarId);
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

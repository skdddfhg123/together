import 'package:cached_network_image/cached_network_image.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/screens/edit_profile_page.dart';
import 'package:calendar/widget/calendar_utils.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MyProfile extends StatelessWidget {
  const MyProfile({super.key});

  @override
  Widget build(BuildContext context) {
    final AuthController authController = Get.find<AuthController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text("계정 관리"),
        centerTitle: true,
        actions: <Widget>[
          PopupMenuButton<String>(
            onSelected: (String result) {
              switch (result) {
                case 'logout':
                  authController.logout();
                  Get.offAllNamed('/login');
                  break;
                case 'delete_account':
                  // 계정 삭제 로직 구현
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: const Text("계정 삭제"),
                        content:
                            const Text("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."),
                        actions: <Widget>[
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop(); // 다이얼로그 닫기
                            },
                            child: const Text("취소"),
                          ),
                          TextButton(
                            onPressed: () {
                              // 계정 삭제 로직 수행
                              Navigator.of(context).pop(); // 다이얼로그 닫기
                            },
                            child: const Text("삭제"),
                          ),
                        ],
                      );
                    },
                  );
                  break;
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'logout',
                child: Text('로그아웃'),
              ),
              const PopupMenuItem<String>(
                value: 'delete_account',
                child: Text('탈퇴 및 계정삭제'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(top: 20),
            child: CircleAvatar(
              radius: 60,
              backgroundImage: CachedNetworkImageProvider(
                  authController.user?.thumbnail ??
                      'https://via.placeholder.com/150'),
              backgroundColor: Colors.transparent,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            authController.user?.nickname ?? "닉네임 없음",
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              // 프로필 편집 페이지로 이동
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => EditProfilePage(),
                ),
              );
            },
            style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all(Colors.white),
            ),
            child: const Text(
              '프로필 편집',
              style: TextStyle(
                color: Colors.black,
              ),
            ),
          ),
          const Divider(height: 30, thickness: 2),
          ListTile(
            title: const Text('연동된 앱 관리', style: TextStyle(fontSize: 16)),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {
              showSyncLoginPageModal(context);
            },
          ),
          syncButton(),
        ],
      ),
    );
  }
}

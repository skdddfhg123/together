import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SyncLoginPage extends StatefulWidget {
  SyncLoginPage({super.key});

  @override
  State<SyncLoginPage> createState() => _SyncLoginPageState();
}

class _SyncLoginPageState extends State<SyncLoginPage> {
  final RxBool isLoggedIn = false.obs;

  @override
  void initState() {
    super.initState();
    checkLoginStatus(); // initState에서 로그인 상태를 검사
  }

  // 로그인 상태 관리
  Future<void> signInWithKakao() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

// 카카오톡 실행 가능 여부 확인
// 카카오톡 실행이 가능하면 카카오톡으로 로그인, 아니면 카카오계정으로 로그인
    if (await isKakaoTalkInstalled()) {
      try {
        OAuthToken token = await UserApi.instance.loginWithKakaoTalk();
        await saveToken(prefs, token);
        isLoggedIn.value = true;
        print('카카오톡으로 로그인 성공');
      } catch (error) {
        print('카카오톡으로 로그인 실패 $error');

        // 사용자가 카카오톡 설치 후 디바이스 권한 요청 화면에서 로그인을 취소한 경우,
        // 의도적인 로그인 취소로 보고 카카오계정으로 로그인 시도 없이 로그인 취소로 처리 (예: 뒤로 가기)
        if (error is PlatformException && error.code == 'CANCELED') {
          return;
        }
        // 카카오톡에 연결된 카카오계정이 없는 경우, 카카오계정으로 로그인
        try {
          OAuthToken token = await UserApi.instance.loginWithKakaoAccount();
          await saveToken(prefs, token);
          isLoggedIn.value = true;
          print('카카오계정으로 로그인 성공');
        } catch (error) {
          print('카카오계정으로 로그인 실패 $error');
        }
      }
    } else {
      try {
        OAuthToken token = await UserApi.instance.loginWithKakaoAccount();
        await saveToken(prefs, token);
        isLoggedIn.value = true;
        print('카카오계정으로 로그인 성공');
      } catch (error) {
        print('카카오계정으로 로그인 실패 $error');
      }
    }
  }

  Future<void> saveToken(SharedPreferences prefs, OAuthToken token) async {
    await prefs.setString('kakaoAccessToken', token.accessToken);
    if (token.refreshToken != null) {
      await prefs.setString('kakaoRefreshToken', token.refreshToken!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('연동 앱 관리'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Obx(() => isLoggedIn.value
                ? logoutButton(context)
                : getKakaoLoginButton()),
          ],
        ),
      ),
    );
  }

  Future<void> checkLoginStatus() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? accessToken = prefs.getString('kakaoAccessToken');
    if (accessToken != null) {
      try {
        var tokenInfo = await UserApi.instance.accessTokenInfo();
        isLoggedIn.value = true;
      } catch (error) {
        isLoggedIn.value = false;
        prefs.remove('kakaoAccessToken');
        prefs.remove('kakaoRefreshToken');
      }
    }
  }

  Widget getKakaoLoginButton() {
    return InkWell(
      onTap: () {
        signInWithKakao();
      },
      child: Card(
        margin: const EdgeInsets.fromLTRB(20, 20, 20, 0),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(7)),
        elevation: 2,
        child: Container(
          height: 50,
          decoration: BoxDecoration(
            color: Colors.yellow,
            borderRadius: BorderRadius.circular(7),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/images/kakao.png', height: 30),
              const SizedBox(
                width: 10,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget logoutButton(BuildContext context) {
    return InkWell(
      onTap: () async {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.remove('kakaoAccessToken');
        await prefs.remove('kakaoRefreshToken');
        isLoggedIn.value = false;
        print('Logged out');
      },
      child: Card(
        margin: const EdgeInsets.fromLTRB(20, 20, 20, 0),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(7)),
        elevation: 2,
        child: Container(
          height: 50,
          decoration: BoxDecoration(
            color: Colors.yellow,
            borderRadius: BorderRadius.circular(7),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/images/kakao_logout.png', height: 30),
              const SizedBox(
                width: 10,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

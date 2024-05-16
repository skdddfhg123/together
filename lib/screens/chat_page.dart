import 'package:cached_network_image/cached_network_image.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/message.dart';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class ChatPage extends StatefulWidget {
  final String calendarId;
  final String calendartitle;

  ChatPage({Key? key, required this.calendarId, required this.calendartitle})
      : super(key: key);

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  late io.Socket _socket;
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<Message> messages = [];
  final AuthController authController = Get.find<AuthController>();
  final MeetingController meetingController = Get.find<MeetingController>();
  bool isLoading = false;
  String? lastMessageDate;

  @override
  void initState() {
    initializeSocket();
    super.initState();
  }

  // 스크롤을 마지막으로 이동하는 함수
  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  String formatDateTime(String isoString) {
    DateTime utcTime = DateTime.parse(isoString);
    DateTime kstTime = utcTime.toLocal(); // UTC 시간에 9시간을 추가
    return DateFormat('a hh:mm', 'ko').format(kstTime); // 한국어 로케일로 날짜 형식 지정
  }

  bool _isNewDay(int index) {
    if (index == 0) return true; // 첫 번째 메시지는 항상 새로운 날짜
    DateTime currentMessageTime =
        DateTime.parse(messages[index].registerdAt).toLocal();
    DateTime previousMessageTime =
        DateTime.parse(messages[index - 1].registerdAt).toLocal();

    return currentMessageTime.day != previousMessageTime.day ||
        currentMessageTime.month != previousMessageTime.month ||
        currentMessageTime.year != previousMessageTime.year;
  }

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(widget.calendartitle),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {
              Navigator.pop(context);
              meetingController
                  .loadMemberAppointmentsForCalendar(widget.calendarId);
            },
            icon: const Icon(Icons.exit_to_app),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final message = messages[index];
                final isMine = message.email == authController.user?.useremail;

                // 메시지 보낸 유저의 썸네일 가져오기
                final member = meetingController.memberAppointments
                    .firstWhereOrNull(
                        (member) => member.useremail == message.email);
                final thumbnailUrl = member?.thumbnail ?? '';

                return Column(
                  crossAxisAlignment: isMine
                      ? CrossAxisAlignment.end
                      : CrossAxisAlignment.start,
                  children: [
                    if (_isNewDay(index))
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            DateFormat('yyyy년 MM월dd일 (EEE)', 'ko').format(
                              DateTime.parse(message.registerdAt).toLocal(),
                            ),
                          ),
                        ),
                      ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8.0, vertical: 4.0),
                      child: Column(
                        crossAxisAlignment: isMine
                            ? CrossAxisAlignment.end
                            : CrossAxisAlignment.start,
                        children: [
                          if (!isMine) ...[
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircleAvatar(
                                  backgroundImage:
                                      CachedNetworkImageProvider(thumbnailUrl),
                                  radius: 15,
                                ),
                                const SizedBox(width: 8),
                                Text(message.nickname),
                              ],
                            ),
                            const SizedBox(height: 4),
                          ],
                          Row(
                            mainAxisAlignment: isMine
                                ? MainAxisAlignment.end
                                : MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              if (isMine)
                                Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      formatDateTime(message.registerdAt),
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 10,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                  ],
                                ),
                              Flexible(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 14, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: isMine
                                        ? Colors.blue[200]
                                        : Colors.grey[200],
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    message.message,
                                    maxLines: null,
                                    overflow: TextOverflow.visible,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              if (!isMine)
                                Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      formatDateTime(message.registerdAt),
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 10,
                                      ),
                                    ),
                                  ],
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          TextField(
            controller: _controller,
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.all(20),
              labelText: '메세지 입력',
              suffixIcon: IconButton(
                icon: const Icon(Icons.send),
                onPressed: () {
                  if (_controller.text.isNotEmpty) {
                    _socket.emit('sendMessage', _controller.text);
                    _controller.clear();
                  }
                  _scrollToBottom();
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  void initializeSocket() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token')?.trim();

    if (token == null) {
      print("No token available.");
      return;
    }

    _socket = io.io('http://15.164.174.224:5000', {
      'extraHeaders': {'Authorization': 'Bearer $token'},
      'transports': ['websocket']
    });

    // onConnect 콜백을 한 번만 등록
    _socket.onConnect((_) {
      print('Connected to the chat server. ${widget.calendarId}');
      _socket.emit('enterChatRoom', widget.calendarId);
    });

    _socket.on('getMessage', (data) {
      if (!mounted) return;
      setState(() {
        messages.add(Message.fromJson(data));
        lastMessageDate = messages.last.registerdAt;
      });
    });

    _socket.onDisconnect((_) {
      print('Disconnected from the chat server.');
    });
  }

  @override
  void dispose() {
    if (_socket.connected) {
      _socket.disconnect();
      _socket.dispose();
      messages.clear();
      _scrollController.dispose();
      print(messages);
    }
    super.dispose();
  }
}

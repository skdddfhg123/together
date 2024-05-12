// ignore_for_file: deprecated_member_use

import 'package:calendar/models/message.dart';
import 'package:flutter/material.dart';
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
  late io.Socket _socket; // socket 변수를 인스턴스 변수로 변경
  final TextEditingController _controller = TextEditingController();
  List<Message> messages = [];
  bool _socketInitialized = false; // 변수 이름 변경

  @override
  Widget build(BuildContext context) {
    if (!_socketInitialized) {
      initializeSocket();
      _socketInitialized = true;
    }

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Chat Room'),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(Icons.exit_to_app),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) => ListTile(
                title: Text(messages[index].message),
                subtitle: Text(messages[index].nickname),
              ),
            ),
          ),
          TextField(
            controller: _controller,
            decoration: InputDecoration(
              labelText: '메세지 입력',
              suffixIcon: IconButton(
                icon: const Icon(Icons.send),
                onPressed: () {
                  if (_controller.text.isNotEmpty) {
                    _socket.emit('sendMessage', _controller.text);
                    _controller.clear();
                  }
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
      messages.clear();
      print(messages);
    }
    super.dispose();
  }
}

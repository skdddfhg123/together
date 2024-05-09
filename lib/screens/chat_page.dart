import 'package:calendar/models/message.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class ChatPage extends StatefulWidget {
  final String calendarId;
  final String calendartitle;

  const ChatPage(
      {super.key, required this.calendarId, required this.calendartitle});

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  late io.Socket socket;
  final TextEditingController _controller = TextEditingController();
  List<Message> messages = [];
  bool isSocketInitialized = false;

  @override
  void initState() {
    super.initState();
    if (!isSocketInitialized) {
      initializeSocket();
    }
  }

  void initializeSocket() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token')?.trim();

    if (token == null) {
      print("No token available.");
      return;
    }

    if (!isSocketInitialized) {
      socket = io.io('http://15.164.174.224:5000', {
        'extraHeaders': {'Authorization': 'Bearer $token'},
        'transports': ['websocket']
      });

      socket.onConnect((_) {
        print('Connected to the chat server.');
        socket.emit('enterChatRoom', widget.calendarId);
        print(widget.calendarId);
      });

      socket.on('getMessage', (data) {
        if (!mounted) return;
        setState(() {
          messages.add(Message.fromJson(data));
        });
      });

      socket.onDisconnect((_) {
        print('Disconnected from the chat server.');
      });

      isSocketInitialized = true;
    }
  }

  @override
  void dispose() {
    if (isSocketInitialized && socket.connected) {
      socket.disconnect();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chat Room')),
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
                    socket.emit('sendMessage', _controller.text);
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
}

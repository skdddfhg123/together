class Message {
  final String id;
  final String email;
  final String message;
  final String nickname;

  Message(
      {required this.id,
      required this.message,
      required this.email,
      required this.nickname});

  // JSON 데이터로부터 Message 객체를 생성하는 팩토리 생성자
  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      email: json['email'],
      message: json['message'],
      nickname: json['nickname'],
    );
  }
}

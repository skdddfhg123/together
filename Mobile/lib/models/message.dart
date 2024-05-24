class Message {
  final String id;
  final String email;
  final String message;
  final String nickname;
  final String registerdAt;

  Message(
      {required this.id,
      required this.message,
      required this.email,
      required this.nickname,
      required this.registerdAt});

  // JSON 데이터로부터 Message 객체를 생성하는 팩토리 생성자
  factory Message.fromJson(Map<String, dynamic> json) {
    // 각 필드의 값을 출력
    // print("ID: ${json['id']}");
    // print("Email: ${json['email']}");
    // print("Message: ${json['message']}");
    // print("Nickname: ${json['nickname']}");
    // print("Registered At: ${json['registeredAt']}");

    DateTime parsedDate;
    try {
      parsedDate = DateTime.parse(json['registeredAt']);
    } catch (e) {
      // 파싱 실패 시 현재 시간을 기본값으로 사용
      parsedDate = DateTime.now();
    }

    return Message(
      id: json['id'],
      email: json['email'],
      message: json['message'],
      nickname: json['nickname'],
      registerdAt: parsedDate.toString(),
    );
  }
}

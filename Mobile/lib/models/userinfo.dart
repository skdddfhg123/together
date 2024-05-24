class UserInfo {
  final String useremail;
  final String nickname;
  final String thumbnail;

  const UserInfo({
    required this.useremail,
    required this.nickname,
    required this.thumbnail,
  });

  UserInfo copyWith({String? useremail, String? nickname, String? thumbnail}) {
    return UserInfo(
      useremail: useremail ?? this.useremail,
      nickname: nickname ?? this.nickname,
      thumbnail: thumbnail ?? this.thumbnail,
    );
  }
}

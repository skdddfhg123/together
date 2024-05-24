class Comment {
  final String content;
  final String commentid;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String nickname;
  final String? thumbnail;

  Comment({
    required this.content,
    required this.commentid,
    required this.createdAt,
    required this.updatedAt,
    required this.nickname,
    this.thumbnail,
  });

  factory Comment.fromJson(
      Map<String, dynamic> json, String nickname, String thumbnail) {
    return Comment(
      content: json['content'],
      commentid: json['feedCommentId'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      nickname: nickname,
      thumbnail: thumbnail,
    );
  }

  factory Comment.fromJsonLoad(Map<String, dynamic> json) {
    return Comment(
      content: json['content'],
      commentid: json['feedCommentId'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      nickname: json['nickname'],
      thumbnail: json['thumbnail'] ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4yBIuo_Fy_zUopbWqlVpxfAVZKUQk-EUqmE0Fxt8sQ&s",
    );
  }
}

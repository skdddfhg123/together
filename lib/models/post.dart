class Feed {
  final String nickname;
  final String thumbnail;
  final String content;
  final DateTime createdAt;
  List<String> imageSrcs; // 이미지 URL 목록으로 변경

  Feed({
    required this.nickname,
    required this.thumbnail,
    required this.content,
    required this.createdAt,
    required this.imageSrcs, // List<String> 타입으로 수정
  });

  factory Feed.fromJson(Map<String, dynamic> json) {
    List<String> imageUrls = [];
    if (json['feedImages'] != null && json['feedImages'].isNotEmpty) {
      imageUrls = json['feedImages']
          .map<String>((img) => img['imageSrc'] as String)
          .toList();
    }

    var feedData = json['feed'];

    return Feed(
      nickname: feedData['user']['nickname'],
      // thumbnail 값이 null일 경우, 주어진 URL을 기본값으로 사용합니다.
      thumbnail: feedData['user']['thumbnail'] as String? ??
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4yBIuo_Fy_zUopbWqlVpxfAVZKUQk-EUqmE0Fxt8sQ&s",
      content: feedData['content'],
      createdAt: DateTime.parse(feedData['createdAt']),
      imageSrcs: imageUrls,
    );
  }
}

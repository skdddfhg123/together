import 'package:cached_network_image/cached_network_image.dart';
import 'package:calendar/controllers/auth_controller.dart';
import 'package:calendar/models/comment.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:calendar/controllers/meeting_controller.dart';

class CommentsPage extends StatefulWidget {
  final String feedId;
  final String nickname;
  final String thumbnail;

  const CommentsPage({
    super.key,
    required this.feedId,
    required this.nickname,
    required this.thumbnail,
  });

  @override
  State<CommentsPage> createState() => _CommentsPageState();
}

class _CommentsPageState extends State<CommentsPage> {
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  void _loadComments() {
    // MeetingController 인스턴스를 가져오고 댓글을 로드
    final MeetingController meetingController = Get.find<MeetingController>();
    meetingController.loadCommentsForFeed(widget.feedId);
  }

  String timeAgoSinceDate(DateTime date) {
    final currentDate = DateTime.now();
    final difference = currentDate.difference(date);

    if (difference.inDays > 30) {
      return '${difference.inDays ~/ 30}달 전';
    } else if (difference.inDays > 7) {
      return '${difference.inDays ~/ 7}주 전';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}일 전';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}시간 전';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}분 전';
    } else {
      return '방금 전';
    }
  }

  @override
  Widget build(BuildContext context) {
    final meetingController = Get.find<MeetingController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('댓글'),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: Column(
        children: [
          Expanded(
            child: Obx(() {
              var comments = meetingController.comments
                  .where((c) => c.feedId == widget.feedId)
                  .toList();

              if (comments.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.comment, size: 40, color: Colors.grey[400]),
                      const SizedBox(height: 10),
                      const Text("아직 댓글이 없습니다",
                          style: TextStyle(fontSize: 16, color: Colors.grey)),
                    ],
                  ),
                );
              } else {
                return ListView.builder(
                  itemCount: comments.length,
                  itemBuilder: (context, index) {
                    var comment = comments[index].comment;
                    return Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 10, horizontal: 15),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            backgroundImage: CachedNetworkImageProvider(comment
                                    .thumbnail ??
                                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4yBIuo_Fy_zUopbWqlVpxfAVZKUQk-EUqmE0Fxt8sQ&s'),
                            radius: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      comment.nickname,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Text(
                                      timeAgoSinceDate(comment.createdAt),
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 12,
                                      ),
                                    ),
                                    // const Spacer(),
                                    // _buildPopupMenu(comment), // 트레일링 팝업 메뉴 추가
                                  ],
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  comment.content,
                                  style: const TextStyle(
                                    fontSize: 15,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                );
              }
            }),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                labelText: '댓글을 작성하세요...',
                suffixIcon: IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: () {
                    if (_controller.text.isNotEmpty) {
                      // 현재 로그인한 사용자의 정보를 사용
                      var currentUser = Get.find<AuthController>().user;
                      if (currentUser != null) {
                        meetingController.addComment(
                            widget.feedId,
                            _controller.text,
                            currentUser.nickname, // 로그인한 사용자의 닉네임 사용
                            currentUser.thumbnail // 로그인한 사용자의 썸네일 사용
                            );
                        _controller.clear();
                      }
                    }
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPopupMenu(Comment comment) {
    final authController = Get.find<AuthController>();
    bool isUserComment = comment.nickname == authController.user?.nickname;

    if (!isUserComment) {
      return const SizedBox(); // 사용자 댓글이 아니면 비어 있는 위젯 반환
    }

    return PopupMenuButton<String>(
      onSelected: (value) {
        if (value == 'edit') {
          // 편집 로직 구현
        } else if (value == 'delete') {
          // 삭제 로직 구현
        }
      },
      itemBuilder: (BuildContext context) => [
        const PopupMenuItem<String>(
          value: 'edit',
          child: Text('수정'),
        ),
        const PopupMenuItem<String>(
          value: 'delete',
          child: Text('삭제'),
        ),
      ],
    );
  }
}

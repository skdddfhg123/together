import 'package:cached_network_image/cached_network_image.dart';
import 'package:calendar/screens/comment_page.dart';
import 'package:flutter/material.dart';
import 'package:calendar/models/post.dart';
import 'package:intl/intl.dart';

class FeedDetailPage extends StatefulWidget {
  final Feed feed;
  final String feedid;

  const FeedDetailPage({super.key, required this.feed, required this.feedid});

  @override
  _FeedDetailPageState createState() => _FeedDetailPageState();
}

class _FeedDetailPageState extends State<FeedDetailPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // 현재 시간으로부터 몇 시간 전인지를 계산하는 함수
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
    final DateFormat dateFormat = DateFormat('yyyy년 M월 d일', 'ko_KR');
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '${dateFormat.format(widget.feed.createdAt)}의 추억',
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              leading: CircleAvatar(
                backgroundImage:
                    CachedNetworkImageProvider(widget.feed.thumbnail),
              ),
              title: Text(
                widget.feed.nickname,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              subtitle: Text(
                timeAgoSinceDate(widget.feed.createdAt),
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
            ),
            if (widget.feed.imageSrcs.isNotEmpty)
              Column(
                children: [
                  Container(
                    height: 300,
                    width: double.infinity,
                    child: PageView.builder(
                      controller: _pageController,
                      itemCount: widget.feed.imageSrcs.length,
                      itemBuilder: (_, imageIndex) {
                        return AspectRatio(
                          aspectRatio: 1, // 이미지를 정사각형으로 설정
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: CachedNetworkImage(
                              imageUrl: widget.feed.imageSrcs[imageIndex],
                              fit: BoxFit.cover,
                              placeholder: (context, url) => const Center(
                                child: CircularProgressIndicator(),
                              ),
                              errorWidget: (context, url, error) =>
                                  const Icon(Icons.error),
                            ),
                          ),
                        );
                      },
                      onPageChanged: (int page) {
                        setState(() {
                          _currentPage = page;
                        });
                      },
                    ),
                  ),
                  SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children:
                        List.generate(widget.feed.imageSrcs.length, (index) {
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _currentPage == index
                              ? Colors.blueAccent
                              : Colors.grey,
                        ),
                      );
                    }),
                  ),
                ],
              ),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                IconButton(
                  icon: const Icon(Icons.mode_comment_outlined,
                      color: Colors.black),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      useSafeArea: true,
                      isDismissible: true,
                      backgroundColor:
                          Colors.transparent, // 배경을 투명하게 설정하여 둥근 효과를 극대화
                      builder: (context) => ClipRRect(
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(20.0),
                          topRight: Radius.circular(20.0),
                        ),
                        child: CommentsPage(
                            feedId: widget.feedid,
                            nickname: widget.feed.nickname,
                            thumbnail: widget.feed.thumbnail),
                      ),
                    );
                  },
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Text(
                    widget.feed.nickname,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      widget.feed.content,
                      style: const TextStyle(
                        fontSize: 14,
                      ),
                      softWrap: true,
                      overflow: TextOverflow.visible,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

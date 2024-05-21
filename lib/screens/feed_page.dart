import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:calendar/controllers/feed_controller.dart';
import 'feed_detail_page.dart'; // FeedDetailPage import

class FeedPage extends StatelessWidget {
  final String calendarId;

  FeedPage({required this.calendarId});

  @override
  Widget build(BuildContext context) {
    final feedController = Get.find<FeedController>();

    // 로드 상태를 추가합니다.
    final RxBool isAllImagesLoaded = false.obs;

    // 이미지 로드 상태를 확인하기 위한 FutureBuilder를 사용합니다.
    Future<void> _loadAllImages() async {
      await Future.wait(feedController.feeds.map((feedWithId) {
        final feed = feedWithId.feed;
        if (feed.imageSrcs.isNotEmpty) {
          return precacheImage(
            CachedNetworkImageProvider(feed.imageSrcs.first),
            context,
          );
        }
        return Future.value();
      }));
      isAllImagesLoaded.value = true;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('우리들만의 모든 피드 '),
        centerTitle: true,
      ),
      body: FutureBuilder(
        future: _loadAllImages(),
        builder: (context, snapshot) {
          if (!isAllImagesLoaded.value) {
            return const Center(child: CircularProgressIndicator());
          }

          if (feedController.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          if (feedController.feeds.isEmpty) {
            return const Center(child: Text('피드가 없습니다.'));
          }

          return Obx(() {
            return GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3, // 한 줄에 3개의 썸네일
                crossAxisSpacing: 4,
                mainAxisSpacing: 4,
              ),
              itemCount: feedController.feeds.length,
              itemBuilder: (context, index) {
                final feedWithId = feedController.feeds[index];
                final feed = feedWithId.feed;

                return GestureDetector(
                  onTap: () {
                    Get.to(() => FeedDetailPage(
                          feed: feed,
                          feedid: feedWithId.feedId,
                        ));
                  },
                  child: CachedNetworkImage(
                    imageUrl:
                        feed.imageSrcs.isNotEmpty ? feed.imageSrcs.first : '',
                    placeholder: (context, url) => Container(), // 개별 프로그레스바 제거
                    errorWidget: (context, url, error) =>
                        const Icon(Icons.error),
                    fit: BoxFit.cover,
                  ),
                );
              },
            );
          });
        },
      ),
    );
  }
}

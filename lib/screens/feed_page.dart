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

    return Scaffold(
      appBar: AppBar(
        title: const Text('피드 모아보기'),
        centerTitle: true,
      ),
      body: Obx(() {
        if (feedController.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (feedController.feeds.isEmpty) {
          return const Center(child: Text('피드가 없습니다.'));
        }

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
                imageUrl: feed.imageSrcs.isNotEmpty ? feed.imageSrcs.first : '',
                placeholder: (context, url) =>
                    const CircularProgressIndicator(),
                errorWidget: (context, url, error) => const Icon(Icons.error),
                fit: BoxFit.cover,
              ),
            );
          },
        );
      }),
    );
  }
}

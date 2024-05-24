import 'package:calendar/api/post_service.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:get/get.dart';

class FeedController extends GetxController {
  final FeedService feedService;
  var feeds = <FeedWithId>[].obs;
  var isLoading = false.obs;

  FeedController({required this.feedService});

  void fetchFeeds(String calendarId) async {
    isLoading.value = true;
    try {
      var fetchedFeeds = await feedService.loadFeedsForCalendar(calendarId);
      feeds.assignAll(fetchedFeeds);
    } catch (e) {
      Get.snackbar('Error', 'Failed to load feeds');
    } finally {
      isLoading.value = false;
    }
  }
}

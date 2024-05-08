import 'dart:io';
import 'package:calendar/api/post_service.dart';
import 'package:calendar/controllers/meeting_controller.dart';
import 'package:calendar/models/post.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

class CreateFeedPage extends StatefulWidget {
  final String groupEventId;

  const CreateFeedPage({super.key, required this.groupEventId});

  @override
  _CreateFeedPageState createState() => _CreateFeedPageState();
}

class _CreateFeedPageState extends State<CreateFeedPage> {
  final TextEditingController _contentController = TextEditingController();
  final MeetingController meetingController = Get.find<MeetingController>();
  final FeedService createfeed = FeedService();
  List<File> _selectedImages = [];
  final picker = ImagePicker();
  bool _isLoading = false;
  int _selectedImageIndex = -1;

  Widget _buildImageGallery() {
    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _selectedImages.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedImageIndex = index;
              });
            },
            child: Padding(
              padding: const EdgeInsets.all(4.0),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Image.file(
                    _selectedImages[index],
                    width: 120,
                    height: 120,
                    fit: BoxFit.cover,
                  ),
                  if (_selectedImageIndex == index) // 선택된 이미지 표시
                    Container(
                      width: 120,
                      height: 120,
                      color: Colors.black.withOpacity(0.3),
                      child: Icon(Icons.check, color: Colors.white),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Future<void> _pickImage() async {
    final pickedFiles = await picker.pickMultiImage();
    if (pickedFiles != null) {
      List<File> newImages =
          pickedFiles.map((pickedFile) => File(pickedFile.path)).toList();
      if (newImages.length > 5) {
        newImages = newImages.sublist(0, 5); // 최대 5개 이미지만 선택
      }
      setState(() {
        _selectedImages = newImages;
        _selectedImageIndex = 0; // 첫 번째 이미지를 대표 이미지로 설정
      });
    }
  }

  Future<void> _submitFeed() async {
    if (_isLoading) return;
    if (_contentController.text.isEmpty || _selectedImages.isEmpty) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('내용과 이미지를 입력해주세요.')));
      return;
    }
    setState(() => _isLoading = true);

    FeedWithId? newFeed = await createfeed.createFeedWithImages(
        _contentController.text, widget.groupEventId, _selectedImages);

    setState(() => _isLoading = false);
    if (newFeed != null) {
      meetingController.addFeed(
          newFeed.feed, newFeed.groupeventId, newFeed.feedId);
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('피드 작성 실패')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('새 피드 작성')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: _selectedImageIndex != -1
                    ? Image.file(_selectedImages[_selectedImageIndex],
                        fit: BoxFit.cover) // 선택된 이미지로 변경
                    : const Icon(Icons.add_a_photo,
                        size: 48, color: Colors.white70),
              ),
            ),
            const SizedBox(height: 10),
            _buildImageGallery(),
            TextField(
              controller: _contentController,
              decoration: const InputDecoration(
                hintText: '내용을 입력하세요',
                border: OutlineInputBorder(),
              ),
              maxLines: 5,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _submitFeed,
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('피드 작성'),
            ),
          ],
        ),
      ),
    );
  }
}

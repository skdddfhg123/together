import 'dart:io';
import 'package:calendar/api/post_service.dart';
import 'package:calendar/controllers/meeting_controller.dart';
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
      child: _selectedImages.isNotEmpty
          ? ListView.builder(
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
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(
                            _selectedImages[index],
                            width: 120,
                            height: 120,
                            fit: BoxFit.cover,
                          ),
                        ),
                        if (_selectedImageIndex == index) // 선택된 이미지 표시
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.check, color: Colors.white),
                          ),
                      ],
                    ),
                  ),
                );
              },
            )
          : Center(
              child: const Text(
                '이미지 미리보기',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 16,
                ),
              ),
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
        if (_selectedImages.isNotEmpty) {
          _selectedImageIndex = 0; // 첫 번째 이미지를 대표 이미지로 설정
        } else {
          _selectedImageIndex = -1; // 선택된 이미지가 없을 때 인덱스 초기화
        }
      });
    }
  }

  Future<void> _pickImageFromCamera() async {
    final pickedFile = await picker.pickImage(source: ImageSource.camera);
    if (pickedFile != null) {
      setState(() {
        _selectedImages.add(File(pickedFile.path));
        _selectedImageIndex = _selectedImages.length - 1; // 마지막 이미지를 대표 이미지로 설정
      });
    }
  }

  Future<void> _showImageSourceDialog() async {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('갤러리에서 선택'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage();
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('카메라로 촬영'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImageFromCamera();
                },
              ),
            ],
          ),
        );
      },
    );
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
      appBar: AppBar(
        title: const Text('새 피드 작성'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            GestureDetector(
              onTap: _showImageSourceDialog,
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      spreadRadius: 2,
                      blurRadius: 5,
                    ),
                  ],
                ),
                child: _selectedImageIndex != -1
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(
                          _selectedImages[_selectedImageIndex],
                          fit: BoxFit.cover, // BoxFit.cover로 변경
                        ),
                      )
                    : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.add_a_photo,
                              size: 48, color: Colors.white70),
                          const SizedBox(height: 10),
                          const Text(
                            '이미지 추가',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 10),
            _buildImageGallery(),
            const SizedBox(height: 20),
            TextField(
              controller: _contentController,
              decoration: InputDecoration(
                hintText: '내용을 입력하세요',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.grey[200],
                contentPadding:
                    const EdgeInsets.symmetric(vertical: 15, horizontal: 10),
              ),
              maxLines: 5,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _submitFeed,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blueAccent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('피드 작성', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}

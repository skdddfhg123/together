import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:get/get.dart';
import 'package:calendar/controllers/auth_controller.dart';

class EditProfilePage extends StatefulWidget {
  EditProfilePage({super.key});

  @override
  _EditProfilePageState createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController dobController = TextEditingController();
  ImageProvider? currentThumbnail;

  @override
  void initState() {
    super.initState();
    final authController = Get.find<AuthController>();
    nameController.text = authController.user?.nickname ?? '';
    dobController.text = ''; // 예시 데이터
    String serverImageUrl = authController.user?.thumbnail ?? '';
    currentThumbnail = NetworkImage(serverImageUrl);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("프로필 편집"),
        centerTitle: true,
      ),
      body: ListView(
        children: <Widget>[
          const SizedBox(height: 40),
          Stack(
            alignment: Alignment.center,
            children: [
              CircleAvatar(
                radius: 70,
                backgroundImage: currentThumbnail,
                backgroundColor: Colors.transparent,
              ),
              Positioned(
                bottom: 0,
                child: TextButton(
                  onPressed: () => showEditPhotoDialog(context),
                  style: TextButton.styleFrom(
                    backgroundColor: Colors.black45,
                    minimumSize: const Size(1, 1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    '편집',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
            child: Column(
              children: [
                buildTextField(nameController, '닉네임', '닉네임을 입력하세요'),
                const SizedBox(height: 20),
                buildTextField(dobController, '생년월일', '생년월일을 입력하세요'),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    // 저장 로직 구현
                  },
                  child: const Text('저장'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildTextField(
      TextEditingController controller, String label, String placeholder) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: placeholder,
        border: const OutlineInputBorder(),
        suffixIcon: IconButton(
          icon: const Icon(Icons.clear),
          onPressed: () => controller.clear(),
        ),
      ),
    );
  }

  Future<void> pickImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: source);
    if (image != null) {
      setState(() {
        currentThumbnail = FileImage(File(image.path));
      });
    }
  }

  void showEditPhotoDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('카메라로 사진 찍기'),
                onTap: () {
                  Navigator.pop(context);
                  pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('앨범에서 사진 선택'),
                onTap: () {
                  Navigator.pop(context);
                  pickImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete),
                title: const Text('프로필 사진 삭제'),
                onTap: () {
                  Navigator.pop(context);
                  setState(() {
                    currentThumbnail = const NetworkImage(
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4yBIuo_Fy_zUopbWqlVpxfAVZKUQk-EUqmE0Fxt8sQ&s"); // 사진 삭제 처리
                  });
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

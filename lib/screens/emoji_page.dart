import 'dart:convert';
import 'dart:io';
import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http_parser/http_parser.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_glow/flutter_glow.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter/rendering.dart';
import 'package:image/image.dart' as img;
import 'dart:ui' as ui;
import 'package:gif/gif.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart'; // 추가된 패키지

class TextInfo {
  String text;
  Color color;
  double fontSize;
  Offset position;
  int animationIndex;
  bool useOutline;
  Color outlineColor;

  TextInfo({
    required this.text,
    this.color = Colors.white,
    this.fontSize = 40,
    this.position = const Offset(0, 0),
    this.animationIndex = 0,
    this.useOutline = false,
    this.outlineColor = Colors.black,
  });
}

class ImageEditorScreen extends StatefulWidget {
  final String title;
  final String calendarId;

  const ImageEditorScreen(
      {super.key, required this.title, required this.calendarId});

  @override
  _ImageEditorScreenState createState() => _ImageEditorScreenState();
}

class _ImageEditorScreenState extends State<ImageEditorScreen>
    with SingleTickerProviderStateMixin {
  XFile? _pickedFile;
  CroppedFile? _croppedFile;
  List<TextInfo> _texts = [];
  late AnimationController _animationController;
  late Animation<double> _animation;
  final GlobalKey _imageRepaintBoundaryKey = GlobalKey();

  final List<String> _animationTypes = [
    '바운스효과',
    '깜빡임효과',
    '그네효과',
    '지진효과',
    '심장박동효과'
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.8, end: 1.2).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  SharedPreferences? prefs;

  _ImageEditorScreenState() {
    initializePrefs();
  }

  Future<void> initializePrefs() async {
    prefs = await SharedPreferences.getInstance();
  }

  Future<String?> _loadToken() async {
    return prefs?.getString('token')?.trim();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<ui.Image> captureWidget(GlobalKey key) async {
    RenderRepaintBoundary boundary =
        key.currentContext?.findRenderObject() as RenderRepaintBoundary;
    if (boundary == null) {
      throw Exception('RepaintBoundary를 찾을 수 없습니다.');
    }
    ui.Image image = await boundary.toImage(pixelRatio: 3.0);
    return image;
  }

  Future<void> captureFrames(GlobalKey key, List<img.Image> frames,
      int frameCount, Duration interval) async {
    for (int i = 0; i < frameCount; i++) {
      final ui.Image frame = await captureWidget(key);
      final ByteData? byteData =
          await frame.toByteData(format: ui.ImageByteFormat.png);
      final Uint8List pngBytes = byteData!.buffer.asUint8List();
      final img.Image capturedImage = img.decodeImage(pngBytes)!;
      frames.add(capturedImage);
      await Future.delayed(interval);
    }
  }

  Future<Uint8List> generateGif(List<img.Image> frames,
      {int delay = 100}) async {
    final gifEncoder = img.GifEncoder();
    for (var frame in frames) {
      gifEncoder.addFrame(frame, duration: delay);
    }
    return Uint8List.fromList(gifEncoder.finish()!);
  }

  Future<void> createAndSaveGif() async {
    // 로딩 다이얼로그 표시
    showDialog(
      context: context,
      barrierDismissible: false, // 다이얼로그 외부 클릭으로 닫히지 않도록 설정
      builder: (BuildContext context) {
        return Center(
          child: CircularProgressIndicator(),
        );
      },
    );

    try {
      List<img.Image> frames = [];
      int frameCount = 10; // 프레임 수
      Duration interval = Duration(milliseconds: 10); // 프레임 간격

      await captureFrames(
          _imageRepaintBoundaryKey, frames, frameCount, interval);

      Uint8List gifBytes = await generateGif(frames);

      await saveGif(gifBytes);
    } finally {
      // 로딩 다이얼로그 숨기기
      Navigator.of(context).pop();
    }
  }

  Future<void> saveGif(Uint8List gifBytes) async {
    final directory = await getApplicationDocumentsDirectory();
    final path = '${directory.path}/animated.gif';
    final file = File(path);

    await file.writeAsBytes(gifBytes);

    // SharedPreferences에 경로 저장
    prefs?.setString('gif_path', path);

    print('GIF 저장 성공: $path');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        centerTitle: true,
        backgroundColor: const Color(0xFFBC764A),
      ),
      body: Column(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: _body()),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: createAndSaveGif,
        backgroundColor: Colors.green,
        tooltip: 'GIF 생성 및 저장',
        child: const Icon(Icons.save),
      ),
    );
  }

  Widget _body() {
    if (_croppedFile != null || _pickedFile != null) {
      return _imageCard();
    } else {
      return _uploaderCard();
    }
  }

  Widget _imageCard() {
    return SingleChildScrollView(
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Card(
                elevation: 4.0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      RepaintBoundary(
                        key: _imageRepaintBoundaryKey,
                        child: Stack(
                          children: [
                            _image(),
                            for (var textInfo in _texts) _buildText(textInfo),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24.0),
            _menu(),
          ],
        ),
      ),
    );
  }

  Widget _image() {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    if (_croppedFile != null) {
      final path = _croppedFile!.path;
      return ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 0.8 * screenWidth,
          maxHeight: 0.7 * screenHeight,
        ),
        child: kIsWeb ? Image.network(path) : Image.file(File(path)),
      );
    } else if (_pickedFile != null) {
      final path = _pickedFile!.path;
      return ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: 0.8 * screenWidth,
          maxHeight: 0.7 * screenHeight,
        ),
        child: kIsWeb ? Image.network(path) : Image.file(File(path)),
      );
    } else {
      return const SizedBox.shrink();
    }
  }

  Widget _buildText(TextInfo textInfo) {
    return Positioned(
      left: textInfo.position.dx,
      top: textInfo.position.dy,
      child: GestureDetector(
        onTap: () {
          _editTextDialog(textInfo);
        },
        child: _buildAnimatedText(textInfo),
      ),
    );
  }

  Widget _buildAnimatedText(TextInfo textInfo) {
    switch (textInfo.animationIndex) {
      case 0:
        return ScaleTransition(
          scale: _animation,
          child: _textWidget(textInfo),
        );
      case 1:
        return FadeTransition(
          opacity: TweenSequence<double>([
            TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 50),
            TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 50),
          ]).animate(_animationController),
          child: _textWidget(textInfo),
        );
      case 2:
        return RotationTransition(
          turns: _animation,
          child: _textWidget(textInfo),
        );
      case 3:
        return SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(-0.1, 0),
            end: const Offset(0.1, 0),
          ).animate(_animationController),
          child: _textWidget(textInfo),
        );
      case 4:
        return ScaleTransition(
          scale: Tween<double>(begin: 1.0, end: 1.2).animate(
            CurvedAnimation(
              parent: _animationController,
              curve: Curves.elasticIn,
            ),
          ),
          child: _textWidget(textInfo),
        );
      default:
        return _textWidget(textInfo);
    }
  }

  Widget _textWidget(TextInfo textInfo) {
    return GestureDetector(
      onPanUpdate: (details) {
        setState(() {
          textInfo.position += details.delta;
        });
      },
      onLongPress: () {
        _editTextDialog(textInfo);
      },
      child: Stack(
        children: [
          if (textInfo.useOutline)
            Text(
              textInfo.text,
              style: TextStyle(
                fontSize: textInfo.fontSize,
                foreground: Paint()
                  ..style = PaintingStyle.stroke
                  ..strokeWidth = 6
                  ..color = textInfo.outlineColor,
              ),
            ),
          GlowText(
            textInfo.text,
            style: TextStyle(
              fontSize: textInfo.fontSize,
              color: textInfo.color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _menu() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        FloatingActionButton(
          onPressed: _clear,
          backgroundColor: Colors.redAccent,
          tooltip: '삭제',
          child: const Icon(Icons.delete),
        ),
        if (_croppedFile == null)
          Padding(
            padding: const EdgeInsets.only(left: 32.0),
            child: FloatingActionButton(
              onPressed: _cropImage,
              backgroundColor: const Color(0xFFBC764A),
              tooltip: '자르기',
              child: const Icon(Icons.crop),
            ),
          ),
        Padding(
          padding: const EdgeInsets.only(left: 32.0),
          child: FloatingActionButton(
            onPressed: _addText,
            backgroundColor: const Color(0xFFBC764A),
            tooltip: '텍스트 추가',
            child: const Icon(Icons.text_fields),
          ),
        ),
      ],
    );
  }

  Widget _uploaderCard() {
    return Center(
      child: Card(
        elevation: 4.0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
        child: SizedBox(
          width: 380.0,
          height: 300.0,
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: DottedBorder(
                    radius: const Radius.circular(12.0),
                    borderType: BorderType.RRect,
                    dashPattern: const [8, 4],
                    color: Theme.of(context).highlightColor.withOpacity(0.4),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.image,
                            color: Theme.of(context).highlightColor,
                            size: 80.0,
                          ),
                          const SizedBox(height: 24.0),
                          Text(
                            '이미지를 업로드 하세요',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall!
                                .copyWith(
                                    color: Theme.of(context).highlightColor),
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24.0),
                child: ElevatedButton(
                  onPressed: _showPickerDialog,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                  child: const Text('업로드'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPickerDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('이미지 소스 선택'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                GestureDetector(
                  child: const Text('갤러리'),
                  onTap: () {
                    Navigator.of(context).pop();
                    _pickImage(ImageSource.gallery);
                  },
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  child: const Text('카메라'),
                  onTap: () {
                    Navigator.of(context).pop();
                    _pickImage(ImageSource.camera);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await ImagePicker().pickImage(source: source);
    if (pickedFile != null) {
      setState(() {
        _pickedFile = pickedFile;
      });
    }
  }

  Future<void> _cropImage() async {
    if (_pickedFile != null) {
      final croppedFile = await ImageCropper().cropImage(
        sourcePath: _pickedFile!.path,
        compressFormat: ImageCompressFormat.jpg,
        compressQuality: 100,
        uiSettings: [
          AndroidUiSettings(
            toolbarTitle: '크로퍼',
            toolbarColor: Colors.deepOrange,
            toolbarWidgetColor: Colors.white,
            initAspectRatio: CropAspectRatioPreset.original,
            lockAspectRatio: false,
          ),
          IOSUiSettings(
            title: '크로퍼',
          ),
          WebUiSettings(
            context: context,
            presentStyle: CropperPresentStyle.dialog,
            boundary: const CroppieBoundary(
              width: 520,
              height: 520,
            ),
            viewPort:
                const CroppieViewPort(width: 480, height: 480, type: 'circle'),
            enableExif: true,
            enableZoom: true,
            showZoomer: true,
          ),
        ],
      );
      if (croppedFile != null) {
        setState(() {
          _croppedFile = croppedFile;
        });
      }
    }
  }

  void _addText() {
    final renderBox = _imageRepaintBoundaryKey.currentContext
        ?.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      final imagePosition = renderBox.localToGlobal(Offset.zero);
      final imageSize = renderBox.size;
      TextInfo newTextInfo = TextInfo(
        text: '',
        position: Offset(imageSize.width / 2, imageSize.height / 2),
      );
      setState(() {
        _texts.add(newTextInfo);
      });
      _editTextDialog(newTextInfo);
    }
  }

  void _editTextDialog(TextInfo textInfo) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('텍스트 편집'),
          content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      onChanged: (value) {
                        setState(() {
                          textInfo.text = value;
                        });
                        this.setState(() {});
                      },
                      decoration: const InputDecoration(labelText: '텍스트 입력'),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () =>
                          _showColorPickerDialog(textInfo, setState, false),
                      child: const Text('텍스트 색상 선택'),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () =>
                          _showColorPickerDialog(textInfo, setState, true),
                      child: const Text('윤곽선 색상 선택'),
                    ),
                    const SizedBox(height: 20),
                    SwitchListTile(
                      title: const Text('윤곽선 사용'),
                      value: textInfo.useOutline,
                      onChanged: (value) {
                        setState(() {
                          textInfo.useOutline = value;
                        });
                        this.setState(() {});
                      },
                    ),
                    const SizedBox(height: 20),
                    Slider(
                      value: textInfo.fontSize,
                      min: 10,
                      max: 100,
                      divisions: 90,
                      label: textInfo.fontSize.round().toString(),
                      onChanged: (value) {
                        setState(() {
                          textInfo.fontSize = value;
                        });
                        this.setState(() {});
                      },
                    ),
                    const SizedBox(height: 20),
                    DropdownButton<int>(
                      value: textInfo.animationIndex,
                      items: List.generate(
                        _animationTypes.length,
                        (index) => DropdownMenuItem(
                          value: index,
                          child: Text(_animationTypes[index]),
                        ),
                      ),
                      onChanged: (value) {
                        setState(() {
                          textInfo.animationIndex = value!;
                        });
                        this.setState(() {});
                      },
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _texts.remove(textInfo);
                        });
                        Navigator.of(context).pop();
                        this.setState(() {});
                      },
                      child: const Text('텍스트 삭제'),
                    ),
                  ],
                ),
              );
            },
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('확인'),
            ),
          ],
        );
      },
    );
  }

  void _showColorPickerDialog(
      TextInfo textInfo, StateSetter setState, bool isOutline) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(isOutline ? '윤곽선 색상 선택' : '텍스트 색상 선택'),
          content: SingleChildScrollView(
            child: ColorPicker(
              pickerColor: isOutline ? textInfo.outlineColor : textInfo.color,
              onColorChanged: (color) {
                setState(() {
                  if (isOutline) {
                    textInfo.outlineColor = color;
                  } else {
                    textInfo.color = color;
                  }
                });
                this.setState(() {});
              },
              showLabel: true,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('확인'),
            ),
          ],
        );
      },
    );
  }

  void _clear() {
    setState(() {
      _pickedFile = null;
      _croppedFile = null;
      _texts.clear();
    });
  }
}

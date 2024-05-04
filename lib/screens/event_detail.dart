import 'package:flutter/material.dart';

class EventDetailPage extends StatefulWidget {
  final String eventTitle;
  final DateTime startTime;
  final DateTime endTime;
  final bool isNotified;
  final String calendarName;
  final Color calendarColor;
  final String userProfileImageUrl;

  const EventDetailPage({
    super.key,
    required this.eventTitle,
    required this.startTime,
    required this.endTime,
    required this.isNotified,
    required this.calendarName,
    required this.calendarColor,
    required this.userProfileImageUrl,
  });

  @override
  _EventDetailPageState createState() => _EventDetailPageState();
}

class _EventDetailPageState extends State<EventDetailPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: CircleAvatar(
          backgroundImage: NetworkImage(widget.userProfileImageUrl),
        ),
        actions: <Widget>[
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'edit') {
                // Implement your edit action
              } else if (value == 'delete') {
                // Implement your delete action
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'edit',
                child: Text('Edit'),
              ),
              const PopupMenuItem<String>(
                value: 'delete',
                child: Text('Delete'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(widget.eventTitle,
                style: Theme.of(context).textTheme.headline5),
          ),
          Text('Calendar: ${widget.calendarName}'),
          Text('${widget.startTime} > ${widget.endTime}'),
          Text('Notification: ${widget.isNotified ? "Enabled" : "Disabled"}'),
          Container(
            width: double.infinity,
            height: 20,
            color: widget.calendarColor,
          ),
          Expanded(
            child: ListView.builder(
              itemCount: 20, // Example count for user posts
              itemBuilder: (_, index) => ListTile(
                title: Text('Post $index'),
                subtitle: Text('Detail of post $index'),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Implement your add post action
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

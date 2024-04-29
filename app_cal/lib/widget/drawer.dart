import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
            child: Text(
              'Drawer Header',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.message),
            title: const Text('Messages', style: TextStyle(fontSize: 20)),
            onTap: () {
              // Navigate to Messages screen or perform other actions
              Navigator.pop(context); // Close the drawer
            },
          ),
          ListTile(
            leading: const Icon(Icons.account_circle),
            title: const Text('Profile', style: TextStyle(fontSize: 20)),
            onTap: () {
              // Navigate to Profile screen or perform other actions
              Navigator.pop(context); // Close the drawer
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings', style: TextStyle(fontSize: 20)),
            onTap: () {
              // Navigate to Settings screen or perform other actions
              Navigator.pop(context); // Close the drawer
            },
          ),
        ],
      ),
    );
  }
}

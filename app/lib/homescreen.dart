import 'package:flutter/material.dart';
import 'add_actions.dart';
import 'remove_actions.dart';

class HomeScreen extends StatelessWidget {
  static const routeName = '/home';
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'AREA',
          style: TextStyle(
            fontSize: 24.0,
            fontWeight: FontWeight.bold,
            letterSpacing: 2.0,
          ),
        ),
        backgroundColor: Colors.lightBlue, // Set your preferred background color
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              // Add your notification icon onPressed logic here
            },
          ),
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              // Add your settings icon onPressed logic here
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, AddActionScreen.routeName);
              },
              child: const Text('Add a new action/reaction'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, RemoveScreen.routeName);
              },
              child: const Text('Remove a action/reaction'),
            ),
          ],
        ),
      ),
    );
  }
}

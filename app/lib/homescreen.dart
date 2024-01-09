import 'package:flutter/material.dart';
import 'package:untitled/password_firebase.dart';
import 'add_actions.dart';
import 'google_firebase.dart';

class HomeScreen extends StatelessWidget {
  static const routeName = '/home';
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AREA')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, AddActionScreen.routeName);
              },
              child: const Text('Add a new action'),
            ),
          ],
        ),
      ),
    );
  }
}

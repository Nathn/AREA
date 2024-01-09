import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

class AuthenticationScreen extends StatefulWidget {
  static const routeName = '/authentication';
  const AuthenticationScreen({Key? key}) : super(key: key);

  @override
  State<AuthenticationScreen> createState() => _AuthenticationScreenState();
}

class _AuthenticationScreenState extends State<AuthenticationScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  ValueNotifier userCredential = ValueNotifier('');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AREA')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              userCredential.value = await signInWithEmailPassword(
                  emailController.text, passwordController.text);
              if (userCredential.value != null) {
                print(userCredential.value.user!.email);
              }
            },
            child: const Text('Login'),
          ),
          ElevatedButton(
            onPressed: () async {
              userCredential.value = await registerWithEmailPassword(
                  emailController.text, passwordController.text);
              if (userCredential.value != null) {
                print(userCredential.value.user!.email);
              }
            },
            child: const Text('Register'),
          ),
        ],
      ),
    );
  }

  Future<dynamic> signInWithEmailPassword(
      String email, String password) async {
    try {
      final userCredential = await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: email, password: password);

      return userCredential;
    } on FirebaseAuthException catch (e) {
      print('Failed to sign in with email and password: $e');
    }
  }

  Future<dynamic> registerWithEmailPassword(
      String email, String password) async {
    try {
      final userCredential = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(email: email, password: password);

      await registerUser(userCredential);

      return userCredential;
    } on FirebaseAuthException catch (e) {
      print('Failed to register with email and password: $e');
    }
  }

  Future<void> registerUser(UserCredential userCredential) async {
    try {
      final registrationData = {
        'uid': userCredential.user!.uid,
        'email': userCredential.user!.email,
        'name': userCredential.user!.displayName ?? '',
        'photoURL': userCredential.user!.photoURL ?? '',
      };

      final response = await http.post(
        Uri.parse('http://10.0.2.2:8080/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(registrationData),
      );

      if (response.statusCode == 200) {
        print('User registered successfully');
      } else {
        print('Failed to register user. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Exception during registration: $e');
    }
  }
}

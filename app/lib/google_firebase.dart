import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'password_firebase.dart';
import 'homescreen.dart';

import 'package:http/http.dart' as http;

class GoogleSignInScreen extends StatefulWidget {
    static const routeName = '/google-sign-in';
  const GoogleSignInScreen({Key? key}) : super(key: key);

  @override
  State<GoogleSignInScreen> createState() => _GoogleSignInScreenState();
}

class _GoogleSignInScreenState extends State<GoogleSignInScreen> {
  ValueNotifier userCredential = ValueNotifier('');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // IF authenticated, show user profile image in the app bar
        appBar: AppBar(title: const Text('AREA'), actions: [
          ValueListenableBuilder(
              valueListenable: userCredential,
              builder: (context, value, child) {
                return (userCredential.value == '' ||
                    userCredential.value == null)
                    ? Container()
                    : CircleAvatar(
                  backgroundImage: NetworkImage(
                      userCredential.value.user!.photoURL.toString()),
                );
              }),
        ]),
        body: ValueListenableBuilder(
            valueListenable: userCredential,
            builder: (context, value, child) {
              return (userCredential.value == '' ||
                  userCredential.value == null)
                  ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Card(
                        elevation: 5,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: IconButton(
                          iconSize: 40,
                          icon: Image.asset(
                            'assets/images/google.png',
                            height: 40,
                            width: 40,
                          ),
                          onPressed: () async {
                            userCredential.value = await signInWithGoogle();
                            if (userCredential.value != null) {
                              print(userCredential.value.user!.email);
                            }
                          },
                        ),
                      ),
                      const SizedBox(height: 20),
                      Card(
                        elevation: 5,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: IconButton(
                          iconSize: 40,
                          icon: const Icon(Icons.email), // You can change the icon
                          onPressed: () {
                            // Navigate to the AuthenticationScreen
                            Navigator.pushNamed(
                              context,
                              AuthenticationScreen.routeName,
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                )
              : Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Welcome ${userCredential.value.user!.displayName} !", style: TextStyle(fontSize: 30),),
                    const SizedBox(
                      height: 20,
                    ),

                    ElevatedButton(
                        onPressed: () async {
                          Navigator.pushNamed(
                            context,
                            HomeScreen.routeName,
                          );
                        },
                        child: const Text('Home Screen'))
                    ,
                    const SizedBox(
                      height: 20,
                    ),
                    ElevatedButton(
                        onPressed: () async {
                          bool result = await signOutFromGoogle();
                          if (result) userCredential.value = '';
                        },
                        child: const Text('Logout')),
                  ],
                ),
              );
            }));
  }

  Future<dynamic> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

      final GoogleSignInAuthentication? googleAuth =
      await googleUser?.authentication;

      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth?.accessToken,
        idToken: googleAuth?.idToken,
      );
      final userCredential =
        await FirebaseAuth.instance.signInWithCredential(credential);

      await registerUser(userCredential);

      return userCredential;
    } on Exception catch (e) {
      print('exception->$e');
    }
  }

  Future<void> registerUser(UserCredential userCredential) async {
    try {
      final registrationData = {
        'uid': userCredential.user!.uid,
        'email': userCredential.user!.email,
        'name': userCredential.user!.displayName,
        'photoURL': userCredential.user!.photoURL,
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

  Future<bool> signOutFromGoogle() async {
    try {
      await FirebaseAuth.instance.signOut();
      return true;
    } on Exception catch (_) {
      return false;
    }
  }
}

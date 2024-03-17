import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:untitled/password_firebase.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'firebase_options.dart';
import 'google_firebase.dart';
import 'welcome.dart';
import 'homescreen.dart';
import 'add_actions.dart';
import 'remove_actions.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(

      title: 'AREA',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: WelcomeScreen.routeName,
      routes: {
        WelcomeScreen.routeName: (context) => const WelcomeScreen(),
        GoogleSignInScreen.routeName: (context) => const GoogleSignInScreen(),
        AuthenticationScreen.routeName: (context) => const AuthenticationScreen(),
        HomeScreen.routeName: (context) => const HomeScreen(),
        AddActionScreen.routeName: (context) => const AddActionScreen(),
        RemoveScreen.routeName: (context) => const RemoveScreen(),
      },
    );
  }
}

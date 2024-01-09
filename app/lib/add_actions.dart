import 'package:flutter/material.dart';
import 'api.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:oauth2_client/google_oauth2_client.dart';

class AddActionScreen extends StatefulWidget {
  static const routeName = '/add-action';

  const AddActionScreen({super.key});

  @override
  _AddActionScreenState createState() => _AddActionScreenState();
}

class _AddActionScreenState extends State<AddActionScreen> {
  String action = '';
  String reaction = '';
  Map<String, bool> accessStates = {
    'google': false,
    'yammer': false,
    'github': false,
    'outlook': false,
    'discord': false,
    'facebook': false,
    'reddit': false,
    'stackoverflow': false,
  };
  String successMessage = '';
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(title: const Text('AREA')),
      body: Center(
        child: Column(
          children: [
            const Text("Add an action/reaction"),
            // Render your service buttons
            _buildServiceButton('google', 'Google services', 'assets/images/google.png'),
            _buildServiceButton('yammer', 'Yammer', 'assets/images/yammer.png'),
            _buildServiceButton('github', 'GitHub', 'assets/images/github.png'),
            _buildServiceButton('outlook', 'Outlook', 'assets/images/outlook.png'),
            _buildServiceButton('discord', 'Discord', 'assets/images/discord.png'),
            _buildServiceButton('facebook', 'Facebook', 'assets/images/facebook.png'),
            _buildServiceButton('reddit', 'Reddit', 'assets/images/reddit.png'),
            _buildServiceButton('stackoverflow', 'StackOverflow', 'assets/images/stackoverflow.png'),

            // Your create button
            ElevatedButton(
              onPressed: createActionReaction,
              child: const Text('Create'),
            ),

            // Display success and error messages
            if (successMessage.isNotEmpty)
              Text(
                successMessage,
                style: const TextStyle(color: Colors.green),
              ),
            if (errorMessage.isNotEmpty)
              Text(
                errorMessage,
                style: const TextStyle(color: Colors.red),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceButton(String service, String serviceName, String serviceImage) {
    return ElevatedButton(
      onPressed: () {
        if (!accessStates[service]!) {
          auth(service);
        } else {
          logout(service);
        }
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: accessStates[service]! ? Colors.green[100] : Colors.red[100],
      ),
      child: Row(
        children: [
          Image.asset(
            serviceImage,
            height: 30,
            width: 30,
          ),
          const SizedBox(width: 10),
          Text(serviceName),
          const SizedBox(width: 10),
        ],
      ),
    );
  }

  void auth(String service) async {
    await ExpressServer().serviceAuth(service).then((response) {
      if (response.statusCode != 200) {
        print(response);
        return;
      }
      redirectToUrl(response.body);

      setState(() {
        accessStates[service] = true;
      });
    });
  }

  void logout(String service) async {
    await ExpressServer().logoutFromService(service).then((response) {
      if (response.statusCode != 200) {
        print(response);
        return;
      }
    });
    setState(() {
      accessStates[service] = false;
    });
  }

  void createActionReaction() async {
    await ExpressServer()
        .createActionReaction(action, reaction)
        .then((response) {
      if (response.statusCode != 200) {
        print(response);
        setState(() {
          errorMessage = response.body;
        });
        return;
      }
      setState(() {
        successMessage = "Action/reaction successfully created.";
      });
        });
  }

  void redirectToUrl(String url) async {
    final Uri theUrl = Uri.parse(url);
    if (!await launchUrl(theUrl)) {
      throw Exception('Could not launch $url');
    }
  }
}

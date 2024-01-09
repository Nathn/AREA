import 'package:flutter/material.dart';
import 'api.dart';

class AddActionScreen extends StatefulWidget {
  static const routeName = '/add-action';

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
            Text("Add an action/reaction"),
            // Render your service buttons
            _buildServiceButton('google', 'Google services'),
            _buildServiceButton('yammer', 'Yammer'),
            _buildServiceButton('github', 'GitHub'),
            _buildServiceButton('outlook', 'Outlook'),
            _buildServiceButton('discord', 'Discord'),
            _buildServiceButton('facebook', 'Facebook'),
            _buildServiceButton('reddit', 'Reddit'),
            _buildServiceButton('stackoverflow', 'StackOverflow'),

            // Your create button
            ElevatedButton(
              onPressed: createActionReaction,
              child: Text('Create'),
            ),

            // Display success and error messages
            if (successMessage.isNotEmpty)
              Text(
                successMessage,
                style: TextStyle(color: Colors.green),
              ),
            if (errorMessage.isNotEmpty)
              Text(
                errorMessage,
                style: TextStyle(color: Colors.red),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceButton(String service, String serviceName) {
    return ElevatedButton(
      onPressed: () {
        if (!accessStates[service]!) {
          auth(service);
        } else {
          logout(service);
        }
      },
      child: Row(
        children: [
          Text(serviceName),
          const Spacer(),
          Text(!accessStates[service]! ? 'Logout' : 'Login'),
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

/*

  const createActionReaction = (event) => {
    event.preventDefault();
    expressServer.createActionReaction(action, reaction).then((response) => {
      if (response.status !== 200) {
        console.warn(response);
        setErrorMessage(response.data);
        return;
      }
      setSuccessMessage("Action/reaction successfully created.");
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(response.data) || ""
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
      return;
    });
  };

*/

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
}

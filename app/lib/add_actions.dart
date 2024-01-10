import 'dart:convert';

import 'package:flutter/material.dart';
import 'api.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ServiceData {
  final String nameLong;
  final String nameShort;
  final String type;
  final List<Map<String, dynamic>> actions;
  final List<Map<String, dynamic>> reactions;

  ServiceData({
    required this.nameLong,
    required this.nameShort,
    required this.type,
    required this.actions,
    required this.reactions,
  });

  static Map<String, ServiceData> services = {};

  static void addService(ServiceData service) {
    services[service.nameLong] = service;
  }

  static List<Map<String, dynamic>> getActions(String serviceName) {
    return services.containsKey(serviceName)
        ? services[serviceName]!.actions
        : [];
  }

  static List<Map<String, dynamic>> getReactions(String serviceName) {
    return services.containsKey(serviceName)
        ? services[serviceName]!.reactions
        : [];
  }
}

class ActionWidget extends StatelessWidget {
  final String nameLong;
  final String description;

  ActionWidget({required this.nameLong, required this.description});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8.0),
      child: ListTile(
        title: Text(nameLong),
        subtitle: Text(description),
      ),
    );
  }
}


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
    'twitch': false,
    'youtube': false,
  };
  List<ServiceData> serviceDataList = [];
  String successMessage = '';
  String errorMessage = '';

  String selectedAction = '';
  String selectedReaction = '';
  String selectedServiceAction = '';
  String selectedServiceReaction = '';
  // selectedAction and selectedReaction are used to store the selected action and reaction
  // so that we can display the selected action and reaction in the UI

  @override
  Widget build(BuildContext context) {

    List<Widget> serviceButtons = [
      _buildServiceButton('google', 'Google services', 'assets/images/google.png'),
      _buildServiceButton('yammer', 'Yammer', 'assets/images/yammer.png'),
      _buildServiceButton('github', 'GitHub', 'assets/images/github.png'),
      _buildServiceButton('outlook', 'Outlook', 'assets/images/outlook.png'),
      _buildServiceButton('discord', 'Discord', 'assets/images/discord.png'),
      _buildServiceButton('facebook', 'Facebook', 'assets/images/facebook.png'),
      _buildServiceButton('reddit', 'Reddit', 'assets/images/reddit.png'),
      _buildServiceButton('twitch', 'Twitch', 'assets/images/twitch.png'),
      _buildServiceButton('youtube', 'Youtube', 'assets/images/youtube.png'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('AREA')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  crossAxisSpacing: 8.0,
                  mainAxisSpacing: 8.0,
                ),
                itemCount: serviceButtons.length,
                itemBuilder: (BuildContext context, int index) {
                  return serviceButtons[index];
                },
              ),
            ),
            // Action and Reaction selection dropdowns
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [

              Flexible(
              child:DropdownButton<String>(
                  isExpanded: true,
                  hint: const Text('Select a Action service'),
                  value: selectedServiceAction.isNotEmpty ? selectedServiceAction : null,
                  onChanged: (String? newValue) {
                    setState(() {
                      selectedServiceAction = newValue ?? '';
                      // Reset selectedReaction when changing the service
                      selectedReaction = '';
                    });
                  },
                  items: ServiceData.services.keys.map((String serviceName) {
                    return DropdownMenuItem<String>(
                      value: serviceName,
                      child: Text(serviceName),
                    );
                  }).toList(),
                ),
              ),

              Flexible(
              child:
                DropdownButton<String>(
              isExpanded: true,
                hint: const Text('Select a Reaction service'),
                value: selectedServiceReaction.isNotEmpty ? selectedServiceReaction : null,
                onChanged: (String? newValue) {
                  setState(() {
                    selectedServiceReaction = newValue ?? '';
                    // Reset selectedReaction when changing the service
                    selectedReaction = '';
                  });
                },
                items: ServiceData.services.keys.map((String serviceName) {
                  return DropdownMenuItem<String>(
                    value: serviceName,
                    child: Text(serviceName),
                  );
                }).toList(),
                ),
              ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // Dropdown for selecting a service

                if (selectedServiceAction.isNotEmpty)
                // Dropdown for selecting an action based on the selected service
                  Flexible(
                    child: DropdownButton<String>(
                    isExpanded: true,
                      hint: const Text('Select an action'),
                      value: selectedAction.isNotEmpty ? selectedAction : null,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedAction = newValue ?? '';
                        });
                      },
                      items: ServiceData.getActions(selectedServiceAction)
                          .map((Map<String, dynamic> action) {
                        return DropdownMenuItem<String>(
                          value: action['name_long'],
                          child: Text(action['name_long']),
                        );
                      }).toList(),
                    ),
                  ),
                if (selectedServiceAction.isNotEmpty)
                // Dropdown for selecting a reaction based on the selected service
                  Flexible(
                    child: DropdownButton<String>(
                    isExpanded: true,
                      hint: const Text('Select a reaction'),
                      value: selectedReaction.isNotEmpty ? selectedReaction : null,
                      onChanged: (String? newValue) {
                        setState(() {
                          selectedReaction = newValue ?? '';
                        });
                      },
                      items: ServiceData.getReactions(selectedServiceReaction)
                          .map((Map<String, dynamic> reaction) {
                        return DropdownMenuItem<String>(
                          value: reaction['name_long'],
                          child: Text(reaction['name_long']),
                        );
                      }).toList(),
                    ),
                  ),
              ],
            ),

            ElevatedButton(
              onPressed: () {
                if (selectedAction.isNotEmpty && selectedReaction.isNotEmpty) {
                  // Call your function to create action/reaction
                  createActionReaction();
                }
              },
              child: const Text('Create Action/Reaction'),
            ),
            // Your create button
            // If selectedAction and selectedReaction are not empty, show the create button
            ElevatedButton(
              onPressed: service,
              child: const Text('services'),
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
      child: SizedBox(
        height: 120, // Set the height of the grid item
        width: 120,  // Set the width of the grid item
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              serviceImage,
              height: 60,  // Set the height of the image
              width: 60,   // Set the width of the image
            ),
          ],
        ),
      ),
    );
  }

  void auth(String service) async {
    var uid = FirebaseAuth.instance.currentUser!.uid;
    var id = await userid(uid);
    Map<String, dynamic> state = json.decode(id);
    String trueId = state['_id'];

    await ExpressServer().serviceAuth(service, trueId).then((response) {
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

  Future<String> userid(uid) async {
    try {
      final response = await ExpressServer().getUserData(uid);

      if (response.statusCode != 200) {
        print(response);
        return response.body;
      }

      return response.body;
    } catch (error) {
      print(error);
      // Handle error accordingly
      throw error;
    }
  }
  // get service from route localhost:8080/services
  Future<String> service() async {
    try {
      final response = await ExpressServer().getServices();

      var services = json.decode(response.body);

      List<ServiceData> data = [];

        services.forEach((service) {
          ServiceData serviceData = ServiceData(
            nameLong: service['name_long'],
            nameShort: service['name_short'],
            type: service['type'],
            actions: List<Map<String, dynamic>>.from(service['actions']),
            reactions: List<Map<String, dynamic>>.from(service['reactions']),
          );

          ServiceData.addService(serviceData);
        });

        setState(() {
        serviceDataList = data;
      });

      if (response.statusCode != 200) {
        return response.body;
      }

      return response.body;
    } catch (error) {
      print(error);
      // Handle error accordingly
      throw error;
    }
  }
}

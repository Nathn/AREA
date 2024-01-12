import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'api.dart';

class RemoveScreen extends StatefulWidget {
  static const routeName = '/remove-actions';
  const RemoveScreen({super.key});

  @override
  _RemoveScreenState createState() => _RemoveScreenState();
}

class _RemoveScreenState extends State<RemoveScreen> {
  late List<Map<String, dynamic>> actionReactions = [];

  @override
  void initState() {
    super.initState();
    getUserData();
  }
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
      body:
      Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [

            const Text(
              'Your automations :',
              style: TextStyle(
                fontSize: 20.0,
              ),
            ),

            for (var actionReaction in actionReactions)
              _buildActionReactionCard(actionReaction),
          ],
        ),
      ),
    );
  }

  Widget _buildActionReactionCard(Map<String, dynamic> actionReaction) {
    return Card(
      margin: EdgeInsets.all(10),
      child: ListTile(
        title: Text(actionReaction['action']),
        subtitle: Text(actionReaction['reaction']),
        leading: IconButton(
          icon: Icon(Icons.remove),
          onPressed: () async {
            removeActionReaction(actionReaction);
          },
        ),
      ),
    );
  }

  void getUserData() async {
    var uid = FirebaseAuth.instance.currentUser!.uid;
    final response = await ExpressServer().getUserData(uid);
    if (response.statusCode == 200) {
      setState(() {
        actionReactions = List<Map<String, dynamic>>.from(json.decode(response.body)['action_reactions']);
      });
    } else {
      print(response);
    }
  }

  void removeActionReaction(Map<String, dynamic> actionReaction) async {
    var uid = FirebaseAuth.instance.currentUser!.uid;
    var id = await userid(uid);
    Map<String, dynamic> state = json.decode(id);
    String trueId = state['_id'];
    await ExpressServer().deleteActionReaction(actionReaction['_id'], trueId);
    setState(() {
      //
      actionReactions.remove(actionReaction);
    });
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
}

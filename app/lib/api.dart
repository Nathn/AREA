import 'dart:convert';
import 'package:http/http.dart' as http;

class ExpressServer {

  final String baseUrl = "http://10.0.2.2:8080";

  Future<http.Response> ping() {
    return http.get(Uri.parse('$baseUrl/'));
  }

  Future<http.Response> about() {
    return http.get(Uri.parse('$baseUrl/about.json'));
  }

  Future<http.Response> getServices() {
    return http.get(Uri.parse('$baseUrl/services'));
  }

  Future<http.Response> createUser(Map<String, dynamic> user) {
    return http.post(
      Uri.parse('$baseUrl/register'),
      body: jsonEncode(user),
      headers: {'Content-Type': 'application/json'},
    );
  }

  Future<http.Response> getUserData(String uid) {
    return http.get(Uri.parse('$baseUrl/users/$uid'));
  }

  Future<http.Response> serviceAuth(String service) {
    return http.get(Uri.parse('$baseUrl/services/$service'));
  }

  Future<http.Response> logoutFromService(String service) {
    return http.post(
      Uri.parse('$baseUrl/services/logout/$service'),
      headers: {'withCredentials': 'true'},
    );
  }

  Future<http.Response> createActionReaction(String action, String reaction) {
    return http.post(
      Uri.parse('$baseUrl/createActionReaction/$action/$reaction'),
      headers: {'withCredentials': 'true'},
    );
  }

  Future<http.Response> updateActionReaction(String id, String key, String value) {
    return http.post(
      Uri.parse('$baseUrl/updateActionReaction/$id/$key/$value'),
      headers: {'withCredentials': 'true'},
    );
  }

  Future<http.Response> deleteActionReaction(String arId) {
    return http.post(
      Uri.parse('$baseUrl/deleteActionReaction/$arId'),
      headers: {'withCredentials': 'true'},
    );
  }
}

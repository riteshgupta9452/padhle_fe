import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../config/app_config.dart';
class ApiClient {
  ApiClient() : dio = Dio(BaseOptions(baseUrl: AppConfig.apiBaseUrl, connectTimeout: const Duration(seconds: 15))) { dio.interceptors.add(InterceptorsWrapper(onRequest: (o, h) async { final token = await FirebaseAuth.instance.currentUser?.getIdToken(); if (token != null) o.headers['Authorization'] = 'Bearer $token'; return h.next(o); })); }
  final Dio dio;
}

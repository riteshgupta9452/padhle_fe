import 'package:flutter/material.dart'; import 'package:flutter_riverpod/flutter_riverpod.dart'; import 'package:firebase_core/firebase_core.dart'; import 'routes/router.dart';
Future<void> main() async { WidgetsFlutterBinding.ensureInitialized(); await Firebase.initializeApp(); runApp(const ProviderScope(child: PadhleApp())); }
class PadhleApp extends StatelessWidget { const PadhleApp({super.key}); @override Widget build(BuildContext context) => MaterialApp.router(title: 'Padhle', theme: ThemeData(colorSchemeSeed: Colors.red, brightness: Brightness.dark), routerConfig: appRouter); }

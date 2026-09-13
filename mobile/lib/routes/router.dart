import 'package:go_router/go_router.dart'; import '../screens/home/home_screen.dart'; import '../screens/video/video_screen.dart';
final appRouter = GoRouter(routes: [GoRoute(path: '/', builder: (_, __) => const HomeScreen()), GoRoute(path: '/video/:id', builder: (_, s) => VideoScreen(videoId: s.pathParameters['id']!))]);

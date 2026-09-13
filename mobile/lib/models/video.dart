class Video {
  const Video({required this.id, required this.title, this.description, this.thumbnail, this.hlsUrl, this.duration = 0});
  final String id, title; final String? description, thumbnail, hlsUrl; final int duration;
  factory Video.fromJson(Map<String, dynamic> j) => Video(id: j['id'], title: j['title'], description: j['description'], thumbnail: j['thumbnail'], hlsUrl: j['hlsUrl'], duration: j['duration'] ?? 0);
}

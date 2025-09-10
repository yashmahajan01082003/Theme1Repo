from rest_framework import serializers
from .models import Signup, Leaderboard, Video

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signup
        fields = ["id", "name", "email", "role", "institution", "password"]

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ['email', 'points']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ["id", "title", "theme", "description", "thumbnail", "video", "video_url", "uploaded_at"]
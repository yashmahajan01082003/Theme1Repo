from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Signup, UserProgress,Leaderboard
from .serializers import SignupSerializer
from .serializers import LeaderboardSerializer


@api_view(["POST"])
def register(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    try:
        user = Signup.objects.get(email=email, password=password)
        return Response({"message": "Login successful", "user": SignupSerializer(user).data})
    except Signup.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_leaderboard(request):
    leaderboard_entries = Leaderboard.objects.all()  # already sorted by points descending

    # Build a list with name and points
    result = []
    for entry in leaderboard_entries:
        try:
            user = Signup.objects.get(email=entry.email)
            result.append({
                "name": user.name,
                "points": entry.points
            })
        except Signup.DoesNotExist:
            # fallback if user not found
            result.append({
                "name": entry.email,  # just use email if name not found
                "points": entry.points
            })

    return Response(result)


# Update points
@api_view(['POST'])
def update_points(request):
    email = request.data.get('email')
    points_to_add = request.data.get('points', 0)

    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    leaderboard, created = Leaderboard.objects.get_or_create(email=email)
    leaderboard.points += int(points_to_add)
    leaderboard.save()

    # Return the full sorted leaderboard after update
    full_leaderboard = Leaderboard.objects.all()
    serializer = LeaderboardSerializer(full_leaderboard, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Signup, UserProgress, Leaderboard

@api_view(['GET'])
def get_user_current_rank(request):
    email = request.GET.get('email')
    print(f"Received email: {email}")  # Debug email

    if not email:
        print("No email provided in request")
        return Response({"error": "Email is required"}, status=400)

    # Debug Signup
    try:
        signup_user = Signup.objects.get(email=email)
        print(f"Found signup_user: {signup_user}")
    except Signup.DoesNotExist:
        print(f"Signup user not found for email: {email}")
        return Response({"error": "Signup user not found"}, status=404)

    # Debug Leaderboard
    try:
        leaderboard_entry = Leaderboard.objects.get(email=email)
        print(f"Found leaderboard_entry: {leaderboard_entry.points} points")
    except Leaderboard.DoesNotExist:
        print(f"Leaderboard entry not found for email: {email}")
        return Response({"error": "Leaderboard entry not found"}, status=404)

    # Debug UserProgress
    try:
        progress = UserProgress.objects.get(user=signup_user)
        print(f"Found user progress: Level {progress.level}, XP {progress.xp}")
    except UserProgress.DoesNotExist:
        print(f"User progress not found for user: {signup_user}")
        return Response({"error": "User progress not found"}, status=404)

    data = {
        "name": signup_user.name,
        "points": leaderboard_entry.points,
        "level": progress.level,
        "xp": progress.xp,
        "xp_next_level": progress.xp_next_level,
        "xp_progress_percent": progress.xp_progress_percent,
        "streak_days": progress.streak_days,
        "badge": progress.badge,
    }
    print(f"Returning data: {data}")

    return Response(data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Video
from .serializers import VideoSerializer

@api_view(["GET"])
def get_videos_by_theme(request, theme):
    videos = Video.objects.filter(theme__iexact=theme).order_by("-uploaded_at")
    serializer = VideoSerializer(videos, many=True, context={'request': request})
    return Response(serializer.data)

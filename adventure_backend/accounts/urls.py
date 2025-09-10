from django.urls import path
from .views import register, login, get_leaderboard, update_points, get_user_current_rank, get_videos_by_theme

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login, name="login"),
    path('leaderboard/', get_leaderboard, name='get_leaderboard'),
    path('leaderboard/update/', update_points, name='update_points'),
    path('current-rank/', get_user_current_rank, name='current-rank'),
    path("videos/theme/<str:theme>/", get_videos_by_theme, name="get_videos_by_theme"),
]
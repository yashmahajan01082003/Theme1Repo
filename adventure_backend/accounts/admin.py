from django.contrib import admin
from .models import Signup, Leaderboard, UserProgress, Video

# Register your models here.
admin.site.register(Signup)
admin.site.register(Leaderboard)
admin.site.register(UserProgress)
admin.site.register(Video)
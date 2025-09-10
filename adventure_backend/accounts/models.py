from django.db import models
from django.utils import timezone

class Signup(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50)
    institution = models.CharField(max_length=100)
    password = models.CharField(max_length=128)  # store hashed later (for now plain)

    def __str__(self):
        return self.email

class Leaderboard(models.Model):
    email = models.EmailField(unique=True)
    points = models.IntegerField(default=0)

    class Meta:
        ordering = ['-points']  # Always return sorted by points descending

    def __str__(self):
        return f"{self.email} - {self.points}"


class UserProgress(models.Model):
    """
    Tracks dynamic game/progress stats for a user without touching Signup or Leaderboard.
    """
    user = models.OneToOneField(Signup, on_delete=models.CASCADE, related_name="progress")
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)  # current experience points
    xp_next_level = models.IntegerField(default=1000)  # XP needed for next level
    streak_days = models.IntegerField(default=0)
    last_active = models.DateField(default=timezone.now)
    badge = models.CharField(max_length=100, blank=True, null=True)  # can store badge name or URL

    def __str__(self):
        return f"{self.user.name} - Level {self.level}"

    @property
    def xp_progress_percent(self):
        """Return XP progress as a percentage for frontend progress bar"""
        if self.xp_next_level > 0:
            return min(int((self.xp / self.xp_next_level) * 100), 100)
        return 0

    def update_streak(self):
        """Call this daily to update streak based on last_active"""
        today = timezone.now().date()
        if self.last_active == today - timezone.timedelta(days=1):
            self.streak_days += 1
        elif self.last_active < today - timezone.timedelta(days=1):
            self.streak_days = 1  # reset streak if missed a day
        self.last_active = today
        self.save()

class Video(models.Model):
    title = models.CharField(max_length=200)
    theme = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", blank=True, null=True)
    video = models.FileField(upload_to="videos/", blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CompletedVideo(models.Model):
    user = models.ForeignKey(Signup, on_delete=models.CASCADE, related_name="completed_videos")
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="completed_by")
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "video")  # Prevent duplicates

    def __str__(self):
        return f"{self.user.email} - {self.video.title}"

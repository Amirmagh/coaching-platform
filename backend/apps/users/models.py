from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = [('coachee', 'مراجع'), ('coach', 'کوچ'), ('admin', 'مدیر')]
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='coachee')
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CoachProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_profile')
    bio = models.TextField()
    specializations = models.JSONField(default=list)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    certified = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    total_sessions = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

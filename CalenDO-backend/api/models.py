from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    theme = models.CharField(max_length=20, default='light')
    notification_enabled = models.BooleanField(default=True)
    calendar_view = models.CharField(max_length=20, default='month')
    
    def __str__(self):
        return f"{self.user.username}'s settings"

@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    """Create UserSettings when a new User is created"""
    if created:
        UserSettings.objects.create(user=instance)

class CalendarEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calendar_events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class TodoTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todo_tasks')
    title = models.CharField(max_length=200)
    done = models.BooleanField(default=False)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class SchoolClass(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='school_classes')
    name = models.CharField(max_length=200)
    instructor = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    days_of_week = models.JSONField()  # Store as JSON array
    time = models.CharField(max_length=50)  # e.g. "10:00 AM - 11:15 AM"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

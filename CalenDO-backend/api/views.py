from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import UserSettings, CalendarEvent, TodoTask, SchoolClass
from .serializers import (
    UserSerializer,
    UserSettingsSerializer,
    CalendarEventSerializer,
    TodoTaskSerializer,
    SchoolClassSerializer
)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    API root view that doesn't require authentication
    """
    return Response({
        'message': 'Welcome to the CalenDO API',
        'endpoints': {
            'login': '/api/login/',
            'register': '/api/register/',
            'users': '/api/users/',
            'settings': '/api/settings/',
            'calendar_events': '/api/calendar-events/',
            'todo_tasks': '/api/todo-tasks/',
            'school_classes': '/api/school-classes/',
        }
    })

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the current authenticated user"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class UserSettingsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user settings to be viewed or edited.
    """
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the current user's settings"""
        return UserSettings.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get the current user's settings"""
        settings = UserSettings.objects.get(user=request.user)
        serializer = self.get_serializer(settings)
        return Response(serializer.data)

class CalendarEventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows calendar events to be viewed or edited.
    """
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the current user's calendar events"""
        return CalendarEvent.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class TodoTaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows todo tasks to be viewed or edited.
    """
    serializer_class = TodoTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the current user's todo tasks"""
        return TodoTask.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    @action(detail=False, methods=['get'])
    def incomplete(self, request):
        """Get only incomplete todo tasks"""
        tasks = TodoTask.objects.filter(user=request.user, done=False)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

class SchoolClassViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows school classes to be viewed or edited.
    """
    serializer_class = SchoolClassSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the current user's school classes"""
        return SchoolClass.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

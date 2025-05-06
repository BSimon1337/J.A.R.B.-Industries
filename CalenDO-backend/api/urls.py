from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import auth

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'settings', views.UserSettingsViewSet, basename='settings')
router.register(r'calendar-events', views.CalendarEventViewSet, basename='calendar-events')
router.register(r'todo-tasks', views.TodoTaskViewSet, basename='todo-tasks')
router.register(r'school-classes', views.SchoolClassViewSet, basename='school-classes')

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('register/', auth.register, name='register'),
    path('login/', auth.login, name='login'),
    path('logout/', auth.logout, name='logout'),
]
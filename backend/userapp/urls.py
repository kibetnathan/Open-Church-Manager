from django.urls import path, include
from .views import ProfileViewSet, UserViewSet
from rest_framework import routers
from .views import (
    RegistrationAPIView,
    CurrentUserAPIView,
    GroupListView,
    UsernameCheckAPIView,
)

router = routers.DefaultRouter()
router.register(r"profile", ProfileViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("register/", RegistrationAPIView.as_view(), name="register"),
    path("check-username/", UsernameCheckAPIView.as_view(), name="check-username"),
    path("", include(router.urls)),
    path("users/me/", CurrentUserAPIView.as_view(), name="current-user"),
    path("groups/", GroupListView.as_view()),
]


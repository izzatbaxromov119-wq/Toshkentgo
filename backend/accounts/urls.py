from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import MeView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view()),    # username + password -> access + refresh
    path("refresh/", TokenRefreshView.as_view()),     # refresh -> yangi access
    path("me/", MeView.as_view()),
]

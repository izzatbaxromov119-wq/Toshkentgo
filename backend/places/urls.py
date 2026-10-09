from rest_framework.routers import DefaultRouter

from django.urls import path

from .views import CategoryViewSet, NotificationListView, PlaceViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("places", PlaceViewSet, basename="place")

urlpatterns = router.urls + [
    path("notifications/", NotificationListView.as_view()),
]

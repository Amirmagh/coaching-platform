from rest_framework.routers import DefaultRouter

from apps.analytics.views import AnalyticsEventViewSet

app_name = "analytics"

router = DefaultRouter()
router.register("events", AnalyticsEventViewSet, basename="event")

urlpatterns = router.urls

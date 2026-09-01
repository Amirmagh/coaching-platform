from rest_framework.routers import DefaultRouter

from apps.coaching.views import GoalViewSet, SessionViewSet

app_name = "coaching"

router = DefaultRouter()
router.register("goals", GoalViewSet, basename="goal")
router.register("sessions", SessionViewSet, basename="session")

urlpatterns = router.urls

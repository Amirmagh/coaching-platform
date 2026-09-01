from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("apps.users.urls")),
    path("api/coaching/", include("apps.coaching.urls")),
    path("api/", include("apps.payments.urls")),
    path("api/analytics/", include("apps.analytics.urls")),
]

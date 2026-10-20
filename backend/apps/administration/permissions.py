from rest_framework.permissions import BasePermission


class IsAdminOrModerator(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user.is_authenticated
            and (request.user.is_superuser or request.user.role in {'admin', 'moderator'})
        )

from django.db.models import Count, Sum
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments.models import Payment
from apps.users.models import User

from .models import AdminLog, ContentReport
from .permissions import IsAdminOrModerator


def log_action(request, action, target):
    AdminLog.objects.create(
        admin=request.user, action=action, target_type=target.__class__.__name__,
        target_id=str(target.pk),
    )


def serialize_user(user):
    return {
        'id': user.pk, 'username': user.username, 'email': user.email,
        'role': user.role, 'email_verified': user.email_verified,
        'is_active': user.is_active, 'date_joined': user.date_joined,
    }


class UsersView(APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        users = User.objects.all()
        query = request.query_params.get('search')
        if query:
            users = users.filter(username__icontains=query) | users.filter(email__icontains=query)
        if role := request.query_params.get('role'):
            users = users.filter(role=role)
        return Response([serialize_user(user) for user in users])


class UserDetailView(APIView):
    permission_classes = [IsAdminOrModerator]

    def get_object(self, pk):
        return User.objects.filter(pk=pk).first()

    def get(self, request, pk):
        user = self.get_object(pk)
        return Response(serialize_user(user)) if user else Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        for field in ('role', 'is_active', 'email'):
            if field in request.data:
                setattr(user, field, request.data[field])
        if user.role not in User.Role.values:
            return Response({'detail': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)
        user.save()
        log_action(request, 'update_user', user)
        return Response(serialize_user(user))

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user or user == request.user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        log_action(request, 'delete_user', user)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PaymentsView(APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        payments = Payment.objects.all()
        for field in ('status', 'gateway'):
            if value := request.query_params.get(field):
                payments = payments.filter(**{field: value})
        return Response({
            'results': [{
                'id': item.pk, 'user_id': item.user_id, 'amount': item.amount,
                'gateway': item.gateway, 'status': item.status, 'created_at': item.created_at,
            } for item in payments],
            'total_revenue': payments.filter(status=Payment.Status.COMPLETED).aggregate(total=Sum('amount'))['total'] or 0,
        })


class SessionsView(APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        return Response({'results': [], 'total': 0})


class AnalyticsView(APIView):
    permission_classes = [IsAdminOrModerator]

    def get(self, request):
        return Response({
            'users': User.objects.count(),
            'verified_users': User.objects.filter(email_verified=True).count(),
            'payments_by_status': list(Payment.objects.values('status').annotate(count=Count('id'))),
            'revenue': Payment.objects.filter(status=Payment.Status.COMPLETED).aggregate(total=Sum('amount'))['total'] or 0,
        })


class ReportIssueView(APIView):
    permission_classes = [IsAdminOrModerator]

    def post(self, request):
        required = ('content_type', 'content_id', 'reason')
        if not all(request.data.get(field) for field in required):
            return Response({'detail': 'content_type, content_id and reason are required.'}, status=status.HTTP_400_BAD_REQUEST)
        report = ContentReport.objects.create(reporter=request.user, **{field: request.data[field] for field in required})
        log_action(request, 'report_issue', report)
        return Response({'id': report.pk}, status=status.HTTP_201_CREATED)

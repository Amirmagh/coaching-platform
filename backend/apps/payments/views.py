from rest_framework import mixins, permissions, viewsets

from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer


class PaymentViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

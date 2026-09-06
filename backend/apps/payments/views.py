import requests

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from .models import Payment
from .services import PaymentService


class PaymentThrottle(UserRateThrottle):
    rate = '10/hour'


def serialize(payment):
    return {
        'id': payment.pk, 'amount': payment.amount, 'gateway': payment.gateway,
        'status': payment.status, 'transaction_id': payment.transaction_id,
        'receipt_url': payment.receipt_url, 'metadata': payment.metadata,
        'created_at': payment.created_at,
    }


class CreatePaymentView(APIView):
    throttle_classes = [PaymentThrottle]

    def post(self, request):
        amount = request.data.get('amount')
        gateway = request.data.get('gateway', Payment.Gateway.ZARINPAL)
        metadata = request.data.get('metadata', {})
        if (
            not isinstance(amount, int) or amount <= 0
            or gateway not in Payment.Gateway.values or not isinstance(metadata, dict)
        ):
            return Response({'detail': 'Invalid amount or gateway.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payment, payment_url = PaymentService.create_payment(
                request.user, amount, gateway, metadata
            )
        except (ValueError, requests.RequestException):
            return Response({'detail': 'Payment gateway is unavailable.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({'payment': serialize(payment), 'payment_url': payment_url}, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    throttle_classes = [PaymentThrottle]

    def post(self, request):
        payment = Payment.objects.filter(pk=request.data.get('payment_id'), user=request.user).first()
        if not payment or not PaymentService.verify_payment(payment, request.data.get('authority')):
            return Response({'detail': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'payment': serialize(payment)})


class PaymentHistoryView(APIView):
    def get(self, request):
        return Response([serialize(item) for item in request.user.payments.all()])


class InvoiceView(APIView):
    def get(self, request, pk):
        payment = Payment.objects.filter(pk=pk, user=request.user).first()
        if not payment:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response({'invoice': serialize(payment)})

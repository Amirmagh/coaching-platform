from django.conf import settings
from django.utils import timezone
import requests

from .models import Payment


class PaymentService:
    """Gateway adapter; credentials stay in environment variables."""

    @staticmethod
    def create_payment(user, amount, gateway, metadata):
        if gateway != Payment.Gateway.ZARINPAL:
            raise ValueError('Unsupported payment gateway.')
        merchant_id = getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
        if not merchant_id:
            raise ValueError('Payment gateway is not configured.')
        response = requests.post(
            'https://api.zarinpal.com/pg/v4/payment/request.json',
            json={
                'merchant_id': merchant_id, 'amount': amount, 'callback_url': settings.PAYMENT_CALLBACK_URL,
                'description': metadata.get('description', 'Coaching package purchase'),
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json().get('data', {})
        authority = data.get('authority')
        if not authority:
            raise ValueError('Payment gateway did not provide an authority.')
        payment = Payment.objects.create(
            user=user, amount=amount, gateway=gateway, metadata=metadata,
            authority=authority,
        )
        return payment, f'https://www.zarinpal.com/pg/StartPay/{payment.authority}'

    @staticmethod
    def verify_payment(payment, authority):
        if payment.authority != authority or payment.status != Payment.Status.PENDING:
            return False
        merchant_id = getattr(settings, 'ZARINPAL_MERCHANT_ID', '')
        if not merchant_id:
            return False
        try:
            response = requests.post(
                'https://api.zarinpal.com/pg/v4/payment/verify.json',
                json={'merchant_id': merchant_id, 'amount': payment.amount, 'authority': authority},
                timeout=10,
            )
            response.raise_for_status()
            result = response.json().get('data', {})
        except (requests.RequestException, ValueError):
            return False
        if result.get('code') not in (100, 101):
            return False
        payment.status = Payment.Status.COMPLETED
        payment.transaction_id = str(result.get('ref_id', authority))
        payment.receipt_url = f'{settings.FRONTEND_URL}/payments/invoices/{payment.pk}/'
        payment.completed_at = timezone.now()
        payment.save(update_fields=['status', 'transaction_id', 'receipt_url', 'completed_at'])
        return True

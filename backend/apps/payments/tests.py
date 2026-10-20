from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Payment


class PaymentApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='member', password='safe-password')
        self.client.force_authenticate(self.user)

    @patch('apps.payments.services.requests.post')
    def test_creates_zarinpal_payment_request(self, post):
        post.return_value = Mock(raise_for_status=Mock(), json=lambda: {'data': {'authority': 'authority-1'}})
        with self.settings(ZARINPAL_MERCHANT_ID='merchant-id'):
            response = self.client.post('/api/payments/create/', {
                'amount': 100000, 'gateway': 'zarinpal', 'metadata': {'package_type': 'pro'},
            }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Payment.objects.get().status, Payment.Status.PENDING)

    @patch('apps.payments.services.requests.post')
    def test_verifies_only_gateway_approved_payment(self, post):
        payment = Payment.objects.create(
            user=self.user, amount=100000, gateway='zarinpal', authority='authority-1'
        )
        post.return_value = Mock(raise_for_status=Mock(), json=lambda: {'data': {'code': 100, 'ref_id': 12}})
        with self.settings(ZARINPAL_MERCHANT_ID='merchant-id'):
            response = self.client.post('/api/payments/verify/', {
                'payment_id': payment.pk, 'authority': payment.authority,
            }, format='json')
        self.assertEqual(response.status_code, 200)
        payment.refresh_from_db()
        self.assertEqual(payment.status, Payment.Status.COMPLETED)

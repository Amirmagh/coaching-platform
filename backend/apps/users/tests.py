from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase


class EmailVerificationTests(APITestCase):
    def test_verifies_a_valid_token_once(self):
        user = get_user_model().objects.create_user(username='member', password='safe-password')
        response = self.client.post(f'/api/auth/verify-email/{user.email_verification_token}/')
        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.email_verified)
        self.assertIsNone(user.email_verification_token)

    def test_rejects_expired_token(self):
        user = get_user_model().objects.create_user(username='member', password='safe-password')
        user.email_verification_expires_at = timezone.now() - timedelta(minutes=1)
        user.save()
        response = self.client.post(f'/api/auth/verify-email/{user.email_verification_token}/')
        self.assertEqual(response.status_code, 400)
from datetime import timedelta

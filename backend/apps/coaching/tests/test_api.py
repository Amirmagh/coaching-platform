from django.urls import reverse
from rest_framework.test import APITestCase

from apps.coaching.models import Message, Session
from apps.users.models import User


class SessionMessageAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="client@example.com", raw_pwd="clientpass123")
        self.client.force_authenticate(user=self.user)
        self.session = Session.objects.create(user=self.user)

    def test_neutral_message_returns_next_grow_question(self):
        url = reverse("coaching:session-message", kwargs={"pk": self.session.pk})
        response = self.client.post(url, {"text": "می خوام روی مدیریت زمان کار کنم"})
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data["coach_message"])
        self.assertEqual(
            Message.objects.filter(session=self.session, sender=Message.Sender.COACH).count(), 1
        )

    def test_crisis_message_triggers_immediate_resources(self):
        url = reverse("coaching:session-message", kwargs={"pk": self.session.pk})
        response = self.client.post(url, {"text": "دیگه نمی خوام زنده باشم"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["crisis"]["level"], "imminent")
        self.assertTrue(response.data["crisis"]["resources"])

    def test_unauthenticated_request_is_rejected(self):
        self.client.force_authenticate(user=None)
        url = reverse("coaching:session-message", kwargs={"pk": self.session.pk})
        response = self.client.post(url, {"text": "سلام"})
        self.assertEqual(response.status_code, 401)

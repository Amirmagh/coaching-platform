from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from apps.coaching.models import Question


class CoachingApiTests(TestCase):
    def test_questions_are_public_and_filterable(self):
        response = self.client.get("/api/questions/?phase=goal")
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        self.assertEqual(response.data[0]["phase"], "goal")

    def test_session_requires_authentication(self):
        self.assertEqual(self.client.get("/api/sessions/").status_code, 401)
        user = get_user_model().objects.create_user("user", "user@example.com", "secure-password")
        client = APIClient()
        client.force_authenticate(user)
        self.assertEqual(client.post("/api/sessions/", {}, format="json").status_code, 201)

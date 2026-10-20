from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class AdminPermissionTests(APITestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_user(
            username='admin', password='safe-password', role='admin'
        )
        self.member = get_user_model().objects.create_user(username='member', password='safe-password')

    def test_admin_can_list_users(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get('/api/admin/users/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_member_cannot_access_admin_users(self):
        self.client.force_authenticate(self.member)
        response = self.client.get('/api/admin/users/')
        self.assertEqual(response.status_code, 403)

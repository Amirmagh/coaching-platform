from django.test import TestCase

from apps.users.models import User


class UserModelTests(TestCase):
    def test_create_user_normalizes_email_and_sets_password(self):
        user = User.objects.create_user(email="Test@Example.com", raw_pwd="strongpass123")
        self.assertEqual(user.email, "Test@example.com")
        self.assertTrue(user.check_password("strongpass123"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser_sets_staff_and_superuser_flags(self):
        admin = User.objects.create_superuser(email="admin@example.com", raw_pwd="adminpass123")
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_create_user_without_email_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", raw_pwd="somepass123")

    def test_string_representation_is_email(self):
        user = User.objects.create_user(email="me@example.com", raw_pwd="somepass123")
        self.assertEqual(str(user), "me@example.com")

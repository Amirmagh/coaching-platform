from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.users.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model for the coaching platform, authenticated by email."""

    class Role(models.TextChoices):
        CLIENT = "client", _("Client")
        COACH = "coach", _("Coach")
        ADMIN = "admin", _("Admin")

    email = models.EmailField(_("email address"), unique=True)
    full_name = models.CharField(_("full name"), max_length=150, blank=True)
    phone_number = models.CharField(_("phone number"), max_length=20, blank=True)
    role = models.CharField(
        _("role"), max_length=10, choices=Role.choices, default=Role.CLIENT
    )
    preferred_language = models.CharField(
        _("preferred language"), max_length=10, default="fa"
    )
    is_staff = models.BooleanField(_("staff status"), default=False)
    is_active = models.BooleanField(_("active"), default=True)
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.full_name or self.email

    def get_short_name(self):
        return self.full_name.split(" ")[0] if self.full_name else self.email

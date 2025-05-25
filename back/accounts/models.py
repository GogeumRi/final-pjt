from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import JSONField

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(
        unique=True,
        blank=True,
        null=True,
    )
    nickname = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        unique=True,
    )
    age = models.PositiveIntegerField(
        blank=True,
        null=True,
    )
    current_assets = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    wage = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )

    subscribed_products = JSONField(default=list, blank=True, null=True)
    
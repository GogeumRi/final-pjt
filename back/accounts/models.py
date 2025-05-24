from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(
        unique=True,
        blank=True,
        null=True,
    )
    subscribed_products = models.TextField(
        blank=True,
        null=True,
    )
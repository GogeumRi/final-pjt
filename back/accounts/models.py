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
    # 저장할 때는 문자열이지만 꺼낼 때는 문자열을 리스트로 변환하기 위해서 메서드 정의

    def get_product_list(self):
        if self.subscribed_products:
            return self.subscribed_products.split(',')
        return []
    def set_product_list(self, product_list):
        self.subscribed_products = ','.join(product_list)


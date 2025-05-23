# accounts.serializers.py

from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser

class CustomRegisterSerializer(RegisterSerializer):
    print(">>> RegisterSerializer 로드됨")
    subscribed_products = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        print(">>> validated_data", self.validated_data)
        # 위에서 ListField로 정의했기 때문에 문자열로 변환해줘야 함
        data['subscribed_products'] = self.validated_data.get('subscribed_products', [])
        return data
    
    def save(self, request):
        user = super().save(request)
        data = self.get_cleaned_data()
        print(">>> data", data)
        subscribed_products = data.get('subscribed_products', [])
        user.set_product_list(subscribed_products)
        user.save()
        return user

    

# accounts/serializers.py

import json
# from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import CustomUser

# class CustomRegisterSerializer(RegisterSerializer):
#     subscribed_products = serializers.ListField(
#         child=serializers.CharField(),
#         required=False,
#     )

#     def get_cleaned_data(self):
#         data = super().get_cleaned_data()
#         data['subscribed_products'] = self.validated_data.get('subscribed_products', [])
#         return data

#     def save(self, request):
#         user = super().save(request)
#         products = self.get_cleaned_data()['subscribed_products']
#         user.subscribed_products = products
#         user.save()
#         return user

class CustomUserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing and updating CustomUser profile fields,
    including converting JSON string back into a list.
    """
    subscribed_products = serializers.ListField(
        child=serializers.CharField(),
        source='get_subscribed_list',
        read_only=True,
        help_text="Current subscribed product codes"
    )
    new_subscribed_products = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        help_text="New list of subscribed product codes"
    )

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email',
            'nickname', 'age', 'current_assets', 'wage',
            'subscribed_products', 'new_subscribed_products',
        ]
        read_only_fields = ['id', 'username', 'subscribed_products']

    def update(self, instance, validated_data):
        # Handle nested list update
        new_list = validated_data.pop('new_subscribed_products', None)
        # Update built-in fields
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        # If client provided a new list, overwrite the JSON string
        if new_list is not None:
            instance.subscribed_products = json.dumps(new_list)
            instance.save()
        return instance

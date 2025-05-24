from rest_framework import serializers
from .models import Article, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    like_count = serializers.SerializerMethodField(read_only=True)
    article = serializers.PrimaryKeyRelatedField(read_only=True)
    is_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.username
    
    def get_like_count(self, obj):
        return obj.like_users.count()

    def get_is_liked(self, obj):
        return self.context['request'].user in obj.like_users.all()


class ArticleSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Article
        fields = '__all__'
    
    def get_user(self, obj):
        return obj.user.username
    
    def get_like_count(self, obj):
        return obj.like_users.count()
    
    def get_comments(self, obj):
        return obj.comments.all()
    
    def get_is_liked(self, obj):
        return self.context['request'].user in obj.like_users.all()

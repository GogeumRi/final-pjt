from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404, get_list_or_404
# Create your views here.

from .models import Article, Comment
from .serializers import ArticleSerializer, CommentSerializer

@api_view(['GET', 'POST'])
def article_list(request):
    if request.method == 'GET':
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'detail': '권한이 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ArticleSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE', 'PUT'])
def article_detail(request, article_id):
    article = get_object_or_404(Article, id=article_id)
    if request.method == 'DELETE':
        article.delete()
        return Response({'status': 'ok'})    
    elif request.method == 'PUT':
        serializer = ArticleSerializer(article, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer = ArticleSerializer(article, context={'request': request})
    return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def article_like(request, article_id):
    article = get_object_or_404(Article, id=article_id)
    if request.user in article.like_users.all():
        article.like_users.remove(request.user)
    else:
        article.like_users.add(request.user)
    serializer = ArticleSerializer(article, context={'request': request})
    return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE'])
def comment_list(request, article_id):
    article = get_object_or_404(Article, id=article_id)
    if request.method == 'GET':
        comments = Comment.objects.filter(article=article)
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'detail': '권한이 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user, article=article)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def comment_delete(request, article_id, comment_id):
    comment = get_object_or_404(Comment, article_id=article_id, id=comment_id)
    if request.user != comment.user:
        return Response({'detail': '권한이 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED)
    comment.delete()
    return Response({'status': 'ok'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_like(request, article_id, comment_id):
    comment = get_object_or_404(Comment, article_id=article_id, id=comment_id)
    if request.user in comment.like_users.all():
        comment.like_users.remove(request.user)
    else:
        comment.like_users.add(request.user)
    serializer = CommentSerializer(comment, context={'request': request})
    return Response(serializer.data)    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def comment_edit(request, article_id, comment_id):
    comment = get_object_or_404(Comment, article_id=article_id, id=comment_id)
    if request.user != comment.user:
        return Response({'detail': '권한이 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = CommentSerializer(comment, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


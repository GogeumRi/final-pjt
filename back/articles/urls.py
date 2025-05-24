"""
URL configuration for finalpjt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.article_list, name='article_list'),
    path('articles/<int:article_id>/', views.article_detail, name='article_detail'),
    path('articles/<int:article_id>/like/', views.article_like, name='article_like'),
    path('articles/<int:article_id>/comments/', views.comment_list, name='comment_list'),
    path('articles/<int:article_id>/comments/<int:comment_id>/like/', views.comment_like, name='comment_like'),
    path('articles/<int:article_id>/comments/<int:comment_id>/', views.comment_delete),
]

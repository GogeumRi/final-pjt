from django.shortcuts import render
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer
from .models import CustomUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import CustomUserProfileSerializer


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_fin_prdt(request):
    print(request.user)
    user = CustomUser.objects.get(username=request.user)
    prdts = user.subscribed_products
    if prdts:
        prdt_list = prdts.split(',')
    else:
        prdt_list = []
    return Response({'subscribed': prdt_list}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_fin_prdt(request):
    data = request.data.get('fin_prdt_cd')
    user = CustomUser.objects.get(username=request.user)
    prdts = user.subscribed_products
    if prdts:
        prdt_list = prdts.split(',')
    else:
        prdt_list = []
    if data not in prdt_list:
        prdt_list.append(data)
        prdts = ','.join(prdt_list)
        user.subscribed_products = prdts
        user.save()
        return Response({'message': 'product successfully joined.'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'product already exists.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disjoin_fin_prdt(request):
    data = request.data.get('fin_prdt_cd')
    user = CustomUser.objects.get(username=request.user)
    prdts = user.subscribed_products
    if prdts:
        prdt_list = prdts.split(',')
        if data in prdt_list:
            prdt_list.remove(data)
            prdts = ','.join(prdt_list)
            user.subscribed_products = prdts
            user.save()
            return Response({'message': 'product successfully disjoined.'}, status=status.HTTP_201_CREATED)
    return Response({'message': 'product does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    if request.method == 'GET':
        serializer = CustomUserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = CustomUserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

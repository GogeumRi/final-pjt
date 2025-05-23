from django.shortcuts import render
import requests
from .models import Product, Option
from .serializers import ProductSerializer, OptionSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.

@api_view(['GET'])
def save_interests_info(request):
    BASE_URL = 'http://finlife.fss.or.kr/finlifeapi/'
    API_KEY = '373f4b9b5dcb7f5c755549c6a078f3f7' # 추후 숨길 것
    
    # 정기예금 수집
    URL = BASE_URL + 'depositProductsSearch.json'
    params = {
        'auth': API_KEY,
        'topFinGrpNo': '020000',
        'pageNo': 1
    }
    response = requests.get(URL, params=params).json()
    product_list = response['result']['baseList']
    option_list = response['result']['optionList']

    for p in product_list:
        fin_prdt_cd = p['fin_prdt_cd']
        try:
            Product.objects.get(pk=fin_prdt_cd)

        except Product.DoesNotExist:
            product = ProductSerializer(data=p)
            if product.is_valid():
                product.save()
    
    for op in option_list:
        fin_prdt_cd = op['fin_prdt_cd']
        save_trm = op['save_trm']

        try:
            product_id = Product.objects.get(pk=fin_prdt_cd)
            exist_options = product_id.options.all()
            for ex_op in exist_options:
                if ex_op.save_trm == save_trm:
                    raise Exception('save_trm exists')
            option = OptionSerializer(data=op)
            if option.is_valid():
                option.save()
        except:
            continue
    
    all_product = ProductSerializer(Product.objects.all(), many=True)
    return Response(all_product.data, status=201)

@api_view(['GET'])
def get_interests_info(request):
    all_product = ProductSerializer(Product.objects.all(), many=True)
    return Response(all_product.data, status=200)
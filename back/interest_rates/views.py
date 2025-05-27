from django.shortcuts import render
import requests
from .models import Product, Option
from accounts.models import CustomUser
from .serializers import ProductSerializer, OptionSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.core.mail import EmailMessage
# Create your views here.

@api_view(['GET'])
def save_interests_info(request, product_type):
    BASE_URL = 'http://finlife.fss.or.kr/finlifeapi/'
    API_KEY = '373f4b9b5dcb7f5c755549c6a078f3f7' # 추후 숨길 것
    ADDITIANL_URL = 'depositProductsSearch.json' if product_type == 0 else 'savingProductsSearch.json'

    URL = BASE_URL + ADDITIANL_URL
    params = {
        'auth': API_KEY,
        'topFinGrpNo': '020000',
        'pageNo': 1
    }
    response = requests.get(URL, params=params).json()
    product_list = response['result']['baseList']
    option_list = response['result']['optionList']

    for p in product_list:
        p['prdt_type'] = product_type
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
    
    if product_type == 0:
        return Response({'message': '정기예금 금리 수집 완료'}, status=201)
    elif product_type == 1:
        return Response({'message': '적금 금리 수집 완료'}, status=201)

@api_view(['GET'])
def get_interests_info(request):
    all_product = ProductSerializer(Product.objects.all(), many=True)
    return Response(all_product.data, status=200)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def change_interests(request, pk):
    product = Product.objects.get(pk=pk)
    data = request.data
    all_options = product.options.all()
    mail_context = ""
    for option in all_options:
        trm = option.save_trm
        if trm in data:
            changed_data = [f"가입 {trm}개월:"]
            old_intr = option.intr_rate
            old_intr2 = option.intr_rate2
            if data[trm].get('intr_rate') and data[trm]['intr_rate'] != old_intr:
                option.intr_rate = data[trm]['intr_rate']
                option.save()
                changed_data.append(f"금리 변경 전 {old_intr} => 변경 후 {data[trm]['intr_rate']}")
            if data[trm].get('intr_rate2') and data[trm]['intr_rate2'] != old_intr2:
                option.intr_rate2 = data[trm]['intr_rate2']
                option.save()
                changed_data.append(f"우대금리 변경 전 {old_intr2} => 변경 후 {data[trm]['intr_rate2']}")
            if len(changed_data) > 1:
                mail_context += "\n".join(changed_data)

    all_user = CustomUser.objects.all()
    for user in all_user:
        if user.subscribed_products:
            prdt_list = user.subscribed_products.split(',')
            if pk in prdt_list:
                subject = f"가입하신 상품 {product.fin_prdt_nm} 의 금리가 변경되었습니다."
                address = user.email.rstrip()
                print(address)
                email = EmailMessage(subject, mail_context, to=[address])
                email.send()
    info = ProductSerializer(product)
    return Response(info.data, status=200)
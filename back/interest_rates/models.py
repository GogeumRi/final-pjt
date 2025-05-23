from django.db import models

# Create your models here.
class Product(models.Model):
    dcls_month = models.CharField(max_length=6)
    fin_co_no = models.TextField()
    fin_prdt_cd = models.CharField(max_length=50, primary_key=True)
    kor_co_nm = models.TextField()
    fin_prdt_nm = models.TextField()
    join_way = models.TextField()
    mtrt_int = models.TextField()
    spcl_cnd = models.TextField(blank=True, null=True)
    join_deny = models.IntegerField()
    join_member = models.TextField(blank=True, null=True)
    etc_note = models.TextField(blank=True, null=True)
    max_limit = models.IntegerField(blank=True, null=True)
    dcls_start_day = models.TextField(blank=True, null=True)
    dcls_end_day = models.TextField(blank=True, null=True)
    fin_co_subm_day = models.TextField(blank=True, null=True)

class Option(models.Model):
    dcls_month = models.CharField(max_length=6)
    fin_co_no = models.TextField()
    fin_prdt_cd = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='options')
    intr_rate_type = models.CharField(max_length=1)
    intr_rate_type_nm = models.CharField(max_length=2)
    save_trm = models.TextField()
    intr_rate = models.FloatField()
    intr_rate2 = models.FloatField()

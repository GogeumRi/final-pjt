<template>
  <article class="col-9">
    <h2>정기예금</h2>
      <table class="table table-striped text-center">
        <thead>
            <tr>
            <th scope="col">금융회사명</th>
            <th scope="col">상품명</th>
            <th scope="col">1개월<button class="btn btn-sm" @click="$emit('sortBy', 0)">{{ desc[0] ? "▼" : "▲" }}</button></th>
            <th scope="col">3개월<button class="btn btn-sm" @click="$emit('sortBy', 1)">{{ desc[1] ? "▼" : "▲" }}</button></th>
            <th scope="col">6개월<button class="btn btn-sm" @click="$emit('sortBy', 2)">{{ desc[2] ? "▼" : "▲" }}</button></th>
            <th scope="col">12개월<button class="btn btn-sm" @click="$emit('sortBy', 3)">{{ desc[3] ? "▼" : "▲" }}</button></th>
            <th scope="col">24개월<button class="btn btn-sm" @click="$emit('sortBy', 4)">{{ desc[4] ? "▼" : "▲" }}</button></th>
            <th scope="col">36개월<button class="btn btn-sm" @click="$emit('sortBy', 5)">{{ desc[5] ? "▼" : "▲" }}</button></th>
            </tr>
        </thead>
        <tbody v-for="product in products" :key="product.fin_prdt_nm">
            <tr v-show="product.isShow">
                <th scope="row">{{ product.kor_co_nm }}</th>
                <td><button class="btn btn-sm" @click="selectProduct(product)" data-bs-toggle="modal" data-bs-target="#exampleModal">{{ product.fin_prdt_nm }}</button></td>
                <td v-for="intr in product.intrs">{{ intr }}</td>
            </tr>
        </tbody>
      </table>
  </article>

  <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">정기예금 상세</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <table class="table table-borderless">
                <tbody>
                    <tr>
                    <th class="col-3" scope="row">공시 제출월</th>
                    <td>{{ selectedProduct.dcls_month }}</td>
                    </tr>
                    <tr>
                    <th scope="row">금융회사명</th>
                    <td>{{ selectedProduct.kor_co_nm }}</td>
                    </tr>
                    <tr>
                    <th scope="row">상품명</th>
                    <td>{{ selectedProduct.fin_prdt_nm }}</td>
                    </tr>
                    <tr>
                    <th id="wrap">
                        <div id="box">
                            가입제한
                            <i class="fas fa-circle-question"></i>
                        </div>
                        <div id="tooltip">
                            1: 제한없음 - 일반인 대상의 상품<br>
                            2: 서민전용 - 기초생활수급자 등 서민우대상품<br>
                            3: 일부제한 - 특정인 대상 상품<br>
                            2, 3은 가입대상 요건을 확인하세요.
                        </div>
                    </th>
                    <td>{{ selectedProduct.join_deny }}</td>
                    </tr>
                    <tr>
                    <th scope="row">가입대상</th>
                    <td>{{ selectedProduct.join_member }}</td>
                    </tr>
                    <tr>
                    <th scope="row">가입 방법</th>
                    <td>{{ selectedProduct.join_way }}</td>
                    </tr>
                    <tr>
                    <th scope="row">우대조건</th>
                    <td v-html="selectedProduct.spcl_cnd"></td>
                    </tr>
                    <tr>
                    <th scope="row">기타 유의사항</th>
                    <td v-html="selectedProduct.etc_note"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button type="button" class="btn btn-danger" v-if="selectedProduct.is_joined" @click="join">가입 취소</button>
            <button type="button" class="btn btn-primary" v-else @click="join">상품 가입</button>
        </div>
        </div>
    </div>
    </div>

</template>

<script setup>
defineProps({
    products: Object,
    desc: Object,
})
defineEmits(['sortBy'])
import { ref } from 'vue'

const selectedProduct = ref([])
const selectProduct = (product) => {
  product.etc_note = product.etc_note.replace(/(?:\r\n|\r|\n)/g, '<br />')
  product.spcl_cnd = product.spcl_cnd.replace(/(?:\r\n|\r|\n)/g, '<br />')
  selectedProduct.value = product
  selectedProduct.is_joined = false
}

const join = function () {
    selectedProduct.value.is_joined = !selectedProduct.value.is_joined
}

</script>

<style scoped>
  #wrap{
    position: relative; 
    display: inline-block;
  }
  #box{
    color: black;
  }
  #tooltip{
    position:absolute; 
    left:0px; 
    top:35px; 
    width:300px;
    background: lavender;
    font-size: smaller;
    padding: 10px; 
    border-radius:5px; 
    color: #000; 
    display: none;
  }
  #tooltip:after{
    display: block; 
    content: ''; 
    position: absolute; 
    /* top: -7px; 
    left:15px; 
    width: 0px; 
    height: 0px; 
    border-top: 8px solid none; 
    border-left: 8psolid transparent; 
    border-right: 8px solid transparent; 
    border-bottom: 8px solid #646FD4; */
  } 
  #wrap:hover #tooltip{display: block;}

</style>
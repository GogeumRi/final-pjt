<template>
  <main class="container">
    <h1>예적금 금리 비교하기</h1>
    <h2>정기예금 | 적금</h2>
      <div class="row">
        <InterestSearch :banks="banks" @search-bank="searchBank" />
        <InterestList :products="products" :desc="desc" @sort-by="sortBy" />
      </div>
  </main>
</template>

<script setup>
const props = defineProps({
  prdtType: String,
})
import { ref } from 'vue'
import axios from 'axios'
import InterestSearch from '@/components/InterestSearch.vue'
import InterestList from '@/components/InterestList.vue'
// import { useRouter } from 'vue-router'
// const router = useRouter()

const prdtType = ref(props.prdtType)
const products = ref([])
const banks = ref([])

axios.get(`http://127.0.0.1:8000/api/interest/read/${prdtType.value}`)
.then(res => {
    products.value = []
    res.data.forEach(product => {
        let intrs = ['-', '-', '-', '-', '-', '-']
        const order = ['1', '3', '6', '12', '24', '36']
        product.options.forEach(option => {
            const idx = order.indexOf(option.save_trm)
            if (idx > -1) {
                intrs[idx] = option.intr_rate
            }
        })
        product['intrs'] = intrs
        product['isShow'] = true
        products.value.push(product)
        
        if (
          banks.value.findIndex(
            (bank) => bank.fin_co_no === product.fin_co_no
          ) === -1
        ) {
          banks.value.push(
            {fin_co_no: product.fin_co_no, kor_co_nm: product.kor_co_nm}
          )
        }
    });
}).catch(err =>{
    console.log(err)
})

const searchBank = function (no) {
  products.value.forEach(product => {
    if (no === '-1') {
      product.isShow = true
    } else {
    if (product.fin_co_no === no) {
      product.isShow = true
    } else {
      product.isShow = false
    }
  }
})
}

const desc = ref([false, false, false, false, false, false])
const sortBy = function (num) {
    desc.value[num] = !desc.value[num]

    if (desc.value[num]) {
        products.value.sort(function (a, b) {
        if (a.intrs[num] === '-' & b.intrs[num] === '-') {
            return 0
        } else if (a.intrs[num] === '-') {
            return 1
        } else if (b.intrs[num] === '-') {
            return -1
        } else if (a.intrs[num] > b.intrs[num]) {
            return -1
        } else if (a.intrs[num] < b.intrs[num] > 0) {
            return 1
        } else {
            return 0
        }
    })
    } else {
        products.value.sort(function (a, b) {
        if (a.intrs[num] === '-' & b.intrs[num] === '-') {
            return 0
        } else if (a.intrs[num] === '-') {
            return -1
        } else if (b.intrs[num] === '-') {
            return 1
        } else if (a.intrs[num] > b.intrs[num]) {
            return 1
        } else if (a.intrs[num] < b.intrs[num] > 0) {
            return -1
        } else {
            return 0
        }
    })
    }
}

</script>

<style scoped>

</style>
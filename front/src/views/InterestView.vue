<template>
  <main class="container">
    <h1 class='my-3'>예적금 금리 비교하기</h1>
    <hr>
      <h5>
        <a class="link-underline link-offset-2 link-underline-opacity-0" 
        :class="{ 'link-primary': prdtType, 'link-body-emphasis': !prdtType }" 
        @mouseover="underline" @mouseleave="clear" 
        @click.prevent="changeDeposit">정기예금</a> | 
        <a class="link-underline link-offset-2 link-underline-opacity-0" 
        :class="{ 'link-primary': !prdtType, 'link-body-emphasis': prdtType }" 
        @mouseover="underline" @mouseleave="clear" 
        @click.prevent="changeSaving">적금</a>
      </h5>
      <hr>
        <article class="container">
      <div class="row">
        <InterestSearch 
        :banks="prdtType ? DepositBanks : SavingBanks" 
        :reset="resetKey"
        @search-bank="searchBank" />
        <InterestList 
        :products="prdtType ? DepositList : SavingList" 
        :desc="prdtType ? DepositDesc : SavingDesc" 
        :title="prdtType"
        @sort-by="sortBy" />
      </div>
  </article>
  </main>
</template>

<script setup>
import { ref, onBeforeMount, watchEffect } from 'vue'
import InterestSearch from '@/components/InterestSearch.vue'
import InterestList from '@/components/InterestList.vue'
import { useInterestStore } from '@/stores/interest.js'

const prdtType = ref(true)
const resetKey = ref(0)
const InterestStore = useInterestStore()
const DepositList = ref(InterestStore.getDeposit())
const SavingList = ref(InterestStore.getSaving())
const DepositBanks = InterestStore.allDepositBank
const SavingBanks = InterestStore.allSavingBank

const DepositDesc = ref([false, false, false, false, false, false])
const SavingDesc = ref([false, false, false, false, false, false])

const underline = function () {
    event.target.classList.remove('link-underline-opacity-0')
    event.target.classList.add('link-underline-opacity-100')
}

const clear = function () {
    event.target.classList.remove('link-underline-opacity-100')
    event.target.classList.add('link-underline-opacity-0')
}

const changeDeposit = (() => {
  prdtType.value = true
  resetKey.value++
  DepositList.value.forEach(product => {
      product.isShow = true
  })
})
const changeSaving = (() => {
  prdtType.value = false
  resetKey.value++
  SavingList.value.forEach(product => {
      product.isShow = true
  })
})

const searchBank = function (no, trm) {
  if (prdtType.value) {
    DepositList.value.forEach(product => {
      if (no === '-1' && trm === -1) {
          product.isShow = true
        } else {
        if (no === '-1' && product.intrs[trm] !== '-') {
          product.isShow = true
        } else if (product.fin_co_no === no && trm === -1) {
          product.isShow = true
        } else if (product.fin_co_no === no && product.intrs[trm] !== '-') {
          product.isShow = true
        } else {
          product.isShow = false
        }
      }
    })
  } else {
    SavingList.value.forEach(product => {
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
}

const sortBy = function (num) {
    if (prdtType.value) {
      DepositDesc.value[num] = !DepositDesc.value[num]
      if (DepositDesc.value[num]) {
        DepositList.value.sort(function (a, b) {
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
        DepositList.value.sort(function (a, b) {
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
    } else {
      SavingDesc.value[num] = !SavingDesc.value[num]
      if (SavingDesc.value[num]) {
        SavingList.value.sort(function (a, b) {
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
        SavingList.value.sort(function (a, b) {
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
}

</script>

<style scoped>

</style>
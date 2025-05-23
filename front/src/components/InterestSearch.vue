<template>
  <article class="col">
    <h2>검색하기</h2>
    <h3>검색 조건을 입력하세요.</h3>
    <hr>
    <label for="bank">은행을 선택하세요</label>
    <select class="form-select" id="bank" v-model="bankNo">
      <option selected value="-1">전체은행</option>
      <option v-for="bank in banks" :key="bank.fin_co_no" :value="bank.fin_co_no">{{ bank.kor_co_nm }}</option>
    </select>
    <hr>
    <button class="btn btn-primary" @click="$emit('searchBank', bankNo)">확인</button>
  </article>
</template>

<script setup>
defineProps({
  banks: Object,
})
defineEmits(['searchBank'])
import { ref } from 'vue'

const bankNo = ref('-1')
</script>

<style scoped>
</style>
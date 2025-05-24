<template>
  <article class="col">
    <h2></h2>
    <h3>검색 조건을 입력하세요.</h3>
    <hr>
    <div class="my-3">
    <label for="bank">은행을 선택하세요</label>
    <select class="form-select" id="bank" v-model="bankNo">
      <option selected value="-1">전체은행</option>
      <option v-for="bank in banks" :key="bank.fin_co_no" :value="bank.fin_co_no">{{ bank.kor_co_nm }}</option>
    </select>
    </div>
    <div class="my-3">
    <label for="trm">예치기간</label>
    <select class="form-select" id="trm" v-model="trm">
      <option selected value='-1'>전체기간</option>
      <option v-for="savetrm in saveTrms" :value="savetrm">{{ saveTrmMonth[savetrm] }}개월</option>
    </select>
    </div>
    <hr>
    <div class="d-grid gap-2">
      <button class="btn btn-primary" @click="$emit('searchBank', bankNo, trm)">확인</button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  banks: Object,
  reset: Number,
})
defineEmits(['searchBank'])
import { ref, watch } from 'vue'

const bankNo = ref('-1')
const trm = ref(-1)
const saveTrms = [0, 1, 2, 3, 4, 5]
const saveTrmMonth = [1, 3, 6, 12, 24, 36]

watch(() => props.reset, () => {
  bankNo.value = '-1'
  trm.value = -1
})

</script>

<style scoped>

</style>
<template>
  <main class="container">
    <h1 class="my-3">현물 상품 비교</h1>
    <hr>
      <h5>금 / 은 가격 변동</h5>
      <hr>
        <SpotCondition />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import SpotCondition from '@/components/SpotCondition.vue'

</script>

<style scoped>

</style>
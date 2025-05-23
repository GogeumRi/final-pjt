<template>
  <main class="container">
    <h1>예적금 금리 비교하기</h1>
      <h2>
        <RouterLink :to="{ name: 'interest-info', params: {info: 'deposit'}}">정기예금</RouterLink> | 
        <RouterLink :to="{ name: 'interest-info', params: {info: 'saving'}}">적금</RouterLink>
      </h2>
        <RouterView />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

</script>

<style scoped>

</style>
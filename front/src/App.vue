<template>
  <header>
      <nav class="navbar bg-body-tertiary">
        <div class="container justify-content-end">
            <RouterLink to="/"><button class="btn btn-primary mx-3">Home</button></RouterLink>
            <RouterLink :to="{ name: 'interest-info' }"><button class="btn btn-primary mx-3">금리비교</button></RouterLink>
        </div>
      </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
</style>

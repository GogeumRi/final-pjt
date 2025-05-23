<template>
  <main>
    <h1>금융 Final Project</h1>
    <p v-if="authStore.isAuthenticated && authStore.user">
      <span>환영합니다, {{ authStore.user.username }}님!</span>
    </p>

  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()


// onMounted(() => {
//   if (!authStore.isAuthenticated) {
//     router.push('/signin')
//   }
// })
</script>

<style scoped>
main {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #0d6efd;
  margin-bottom: 1rem;
}

p {
  font-size: 1.25rem;
  color: #198754;
}
</style>
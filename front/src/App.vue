<template>
  <header>
    <nav>
      <RouterLink to="/">홈</RouterLink> |
      <RouterLink :to="{ name: 'interest-info' }"><button class="btn btn-primary mx-3">금리비교</button></RouterLink>
      <RouterLink to="/signup">회원가입</RouterLink> |
      <RouterLink to="/signin" v-if="!isLoggedIn">로그인</RouterLink>
      <button @click="logout" v-else>로그아웃</button>
      <RouterLink to="/articles">게시판</RouterLink>
      <RouterLink to="/articles/create" v-if="isLoggedIn">게시글 작성</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)
const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
nav {
  background-color: #343a40;
  padding: 1rem;
}

nav a {
  color: #f8f9fa;
  margin-right: 1rem;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.25rem;
}

button:hover {
  background-color: #c82333;
}
</style>
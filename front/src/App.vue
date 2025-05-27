<template>
  <header class="border-bottom">
    <!-- 상단 바: 로고 + 로그인/회원가입/로그아웃 -->
    <div class="container d-flex justify-content-between align-items-center py-2">
      <!-- 좌측 로고 -->
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <img src="@/assets/logo.png" alt="로고" height="30" class="me-2" />
        <span>Pynance</span>
      </RouterLink>

      <!-- 우측 로그인/회원가입/로그아웃 -->
      <div>
        <RouterLink to="/signup" class="btn btn-outline-primary me-2" v-if="!isLoggedIn">회원가입</RouterLink>
        <RouterLink to="/signin" class="btn btn-outline-success me-2" v-if="!isLoggedIn">로그인</RouterLink>
        <template v-else class="d-flex align-items-center">
          <span class="text-black fw-bold me-3">{{ authStore.user.username }}님</span>
          <RouterLink to="/profile" class="btn btn-outline-primary me-3" v-if="isLoggedIn">프로필</RouterLink>
          <button @click="logout" class="btn btn-danger">로그아웃</button>
        </template>
      </div>
    </div>

    <!-- 하단 메뉴 바 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fs-5">
      <div class="container">
        <div class="navbar-nav mx-auto">
          <RouterLink :to="{ name: 'home' }" class="nav-link me-5">홈</RouterLink>
          <RouterLink :to="{ name: 'interest' }" class="nav-link me-5">금리비교</RouterLink>
          <RouterLink :to="{ name: 'spot' }" class="nav-link me-5">현물비교</RouterLink>
          <RouterLink :to="{ name: 'video' }" class="nav-link me-5">주식정보</RouterLink>
          <RouterLink :to="{ name: 'map' }" class="nav-link me-5">은행지도</RouterLink>
          <RouterLink to="/articles" class="nav-link me-5">자유게시판</RouterLink>
          <RouterLink to="/recommend" class="nav-link me-5">상품추천</RouterLink>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>


<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInterestStore } from '@/stores/interest.js'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)
const logout = () => {
  authStore.logout()
  router.push('/')
}

const interestStore = useInterestStore()
interestStore.getAll()
</script>

<style scoped>
header {
  position: relative;
  z-index: 1030;
}
</style>
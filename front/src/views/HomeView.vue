<template>
  <div>

    <div id="carouselExampleAutoplaying" class="carousel slide mb-4" data-bs-ride="carousel" data-bs-interval="5000">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@/assets/int_comparison.jpg" class="d-block w-100 carousel-img" alt="금리 비교">
          <div class="carousel-caption d-none d-md-block custom-caption">
            <h1>전국 은행 금리 한눈에 비교</h1>
            <h4>정기예금/적금의 이율을 쉽고 빠르게 확인해보세요</h4>
            <RouterLink to="/interest" class="btn btn-primary">비교하러 가기</RouterLink>
          </div>
        </div>
        <!-- You can later add more carousel-item blocks here for other slides -->
        <div class="carousel-item">
          <img src="@/assets/gold.jpg" class="d-block w-100 carousel-img" alt="금리 비교">
          <div class="carousel-caption d-none d-md-block custom-caption">
            <h1>금과 은의 시세, 한 눈에 확인하세요</h1>
            <h4>금,은 가격 변동을 그래프로 쉽게 파악해보세요</h4>
            <RouterLink to="/spot" class="btn btn-primary">시세 보러가기</RouterLink>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/search.jpg" class="d-block w-100 carousel-img" alt="금리 비교">
          <div class="carousel-caption d-none d-md-block custom-caption">
            <h1>원하는 종목을 검색해보세요</h1>
            <h4>주식 정보를 Youtube 영상으로 쉽고 빠르게 확인해보세요</h4>
            <RouterLink to="/video" class="btn btn-primary">검색 하러가기</RouterLink>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/map.jpg" class="d-block w-100 carousel-img" alt="금리 비교">
          <div class="carousel-caption d-none d-md-block custom-caption">
            <h1>은행을 검색하세요</h1>
            <h4>원하는 장소에서의 근처 원하는 은행을 검색해보세요</h4>
            <RouterLink to="/map" class="btn btn-primary">검색 하러가기</RouterLink>
          </div>
        </div>
  </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()


// onMounted(() => {
//   if (!authStore.isAuthenticated) {
//     router.push('/signin')
//   }
// })
</script>

<style scoped>
.carousel-caption {
  position: absolute;
  top: 30%;
  left: 10%;
  width: 40%;
  max-width: 600px;
  text-align: left;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
}

.carousel-caption h3,
.carousel-caption p {
  color: white;
  margin: 0;
  padding: 0.2rem 0;
}

.carousel-img {
  height: calc(100vh - 138px); /* Adjust for nav/header height */
  width: 100%;
  opacity: 0.7;
  object-fit: cover;
}

.carousel-item {
  background-color: black
}
</style>
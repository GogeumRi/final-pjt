<template>
  <div>

    <div id="carouselExampleAutoplaying" class="carousel slide mb-4" data-bs-ride="carousel" data-bs-interval="5000">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@/assets/int_comparison.jpg" class="d-block w-100 img-fluid" alt="금리 비교">
          <div class="carousel-caption d-none d-md-block">
            <h3>전국 은행 금리 한눈에 비교</h3>
            <p>정기예금/적금의 이율을 쉽고 빠르게 확인해보세요</p>
          </div>
        </div>
        <!-- You can later add more carousel-item blocks here for other slides -->
        <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
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

p {
  font-size: 1.25rem;
  color: #198754;
}

.carousel-item img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
}

</style>
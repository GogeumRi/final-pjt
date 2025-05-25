<template>
  <main class="container">
    <h1 class="my-3">관심 종목 정보 검색</h1>
    <hr>
      <h5>관심 종목 관련 영상 검색</h5>
      <hr>
    <article>
    <form @submit.prevent="onSearch">
        <input
            type="text"
            v-model="keyword"
            placeholder="검색어를 입력하세요"
            class="form-control"
        />
        <button type="submit" class="btn btn-primary">찾기</button>
        </form>
        <div class="video-list">
        <div
            v-for="video in video.videos"
            :key="video.id.videoId"
            class="video-card"
            @click=""
        >
            <img
            :src="video.snippet.thumbnails.medium.url"
            :alt="video.snippet.title"
            class="thumbnail"
            />
            <h3 class="text-body link-underline link-underline-opacity-0" v-html="video.snippet.title"></h3>
            <p class="text-secondary link-underline link-underline-opacity-0">업로드일: {{ video.snippet.publishedAt.slice(0, 10) }}</p>
        </div>
        </div>
    </article>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useVideoStore } from '@/stores/video.js'
const video = useVideoStore()

const keyword = ref('')

// 유튜브 API 키 (본인 키로 교체)
const API_KEY = 'AIzaSyBSGBNUb8tA-V4ed92Qetl2ZB5ElbttjV4'

async function onSearch() {
  if (!keyword.value.trim()) {
    alert('검색어를 입력하세요')
    return
  }
  const query = encodeURIComponent(keyword.value.trim())
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&type=video&q=${query}&key=${API_KEY}&regionCode=kr`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.items) {
      console.log(data.items)
      video.videos = []
      data.items.forEach(item => {
        if (item.id.videoId) {
          video.videos.push(item)
        }
      })
    } else {
      video.videos = []
      alert('검색 결과가 없습니다.')
    }
  } catch (error) {
    alert('검색 중 오류가 발생했습니다.')
    console.error(error)
  }
}
</script>

<style scoped>
.search-container {
  padding: 1rem 2rem;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0 1.5rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #218838;
}

.video-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr); /* 기본: 모바일 */
}

@media (min-width: 576px) {
  .video-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .video-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 992px) {
  .video-list {
    grid-template-columns: repeat(4, 1fr); /* 최대 4개 */
  }
}

.video-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  color: black;
  display: flex;
  flex-direction: column;
}

.thumbnail {
  width: 100%;
  height: auto;
  display: block;
}

</style>
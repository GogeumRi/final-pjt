<template>
  <main class="container">
    <h1 class="my-3">관심 종목 정보 검색</h1>
    <hr>
      <h5>관심 종목 관련 영상 검색</h5>
      <hr>
    <article>
    <form @submit.prevent="onSearch">
      <div class="input-group mb-3">
        <input
            type="text"
            v-model="keyword"
            placeholder="검색어를 입력하세요"
            class="form-control"
        />
        <button type="submit" class="btn btn-primary">찾기</button>
      </div>
        
    </form>
    <div class="container d-flex flex-wrap justify-content-start">
        <div
            v-for="video in video.videos"
            :key="video.id.videoId"
            class="p-2"
             @click.prevent="selectVideo(video)" 
             data-bs-toggle="modal" 
             data-bs-target="#exampleModal"
        >
          <div class="card" style="width: 250px; height: 320px">
            <img
            :src="video.snippet.thumbnails.medium.url"
            :alt="video.snippet.title"
            class="card-img-top"
            />
            <div class="p-3">
              <p class="card-title text-body" v-html="video.snippet.title"></p>
              <p class="card-text text-secondary">업로드일: {{ video.snippet.publishedAt.slice(0, 10) }}</p>
            </div>
            </div>
        </div>
    </div>
    </article>
  </main>

   <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
          <h5 v-html="selectedVideo.snippet.title"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body container">
          <p>업로드 날짜: {{ selectedVideo.snippet.publishedAt.slice(0, 10) }}</p>
          <div class="ratio ratio-16x9">
            <iframe :src="`https://youtube.com/embed/${selectedVideo.id.videoId}`" class="w-100 h-100"></iframe>
          </div>
          <p class="mt-3" v-html="selectedVideo.snippet.description"></p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVideoStore } from '@/stores/video.js'
const video = useVideoStore()
const keyword = ref('')
const selectedVideo = ref({id: {videoId: null}, snippet: {title: null, description: null, publishedAt: 'YYYY-MM-DDTHH:MM:SS'}})

// 유튜브 API 키 (본인 키로 교체)
const API_KEY = 'AIzaSyBSGBNUb8tA-V4ed92Qetl2ZB5ElbttjV4'

async function onSearch() {
  if (!keyword.value.trim()) {
    swal('검색 실패', "검색어를 입력하세요.", 'warning')
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
      swal('검색 실패', "검색 결과가 없습니다.", 'error');
    }
  } catch (error) {
    swal('검색 실패', "검색 도중 오류가 발생했습니다.", 'error');
    console.error(error)
  }
}

const selectVideo = function(video) {
  selectedVideo.value = video
  console.log(selectedVideo.value)
}

</script>

<style scoped>

</style>
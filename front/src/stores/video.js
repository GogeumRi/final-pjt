import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', () => {
    const videos = ref([])
    const getVideo = (id) => {
        return videos.value.find((video) => video.id.videoId === id)
    }
    return { videos, getVideo }
})

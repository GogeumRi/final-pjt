import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', () => {
    const videos = ref([])
    const getVideo = (id) => {
        return videos.value.find((video) => video.id.videoId === id)
    }
    return { videos, getVideo }
})

export const useSavedStore = defineStore('saved', () => {
    const savedVideos = ref([])
    const isSaved = (id) => {
        if (savedVideos.value.find((video) => video.id === id)) {
            return true
        } else {
            return false
        }
    }
    return { savedVideos, isSaved }
})

export const useChannelSavedStore = defineStore('channelSaved', () => {
    const savedChannels = ref([])
    const isSaved = (id) => {
        if (savedChannels.value.find((channel) => channel.id === id)) {
            return true
        } else {
            return false
        }
    }
    return { savedChannels, isSaved }
})
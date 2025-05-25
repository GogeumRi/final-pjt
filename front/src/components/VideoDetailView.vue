<template>
<RouterLink to="/video">
<p><- 뒤로가기</p>
</RouterLink>
<h1 v-html="info.snippet.title"></h1>
<p>업로드 날짜: {{ pubDate }}</p>
<iframe :src="`https://youtube.com/embed/${videoId}`" width="600" height="400"></iframe>
<p>{{ info.snippet.description }}</p>

<!-- <button v-if="isSaved" @click="del" class="btn btn-primary">동영상 저장 취소</button>
<button v-else @click="save" class="btn btn-primary">동영상 저장하기</button>

<button v-if="isChannelSaved" @click="channelDel" class="btn btn-success">채널 저장 취소</button>
<button v-else @click="channelSave" class="btn btn-success">채널 저장하기</button> -->

</template>

<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useVideoStore, useSavedStore, useChannelSavedStore } from '@/stores/video.js'
const videoStore = useVideoStore()
const savedStore = useSavedStore()
const savedChannelStore = useChannelSavedStore()
const route = useRoute()

const videoId = route.params.id
const info = videoStore.getVideo(videoId)
const pubDate = info.snippet.publishedAt.slice(0, 10)
const isSaved = ref(savedStore.isSaved(videoId))

const save = function() {
    savedStore.savedVideos.push(
        {
            id: videoId,
            title: info.snippet.title,
            thumbnail: info.snippet.thumbnails.medium.url
        }
    )
    isSaved.value = true
    console.log(savedStore.savedVideos)
}

const del = function() {
    savedStore.savedVideos = savedStore.savedVideos.filter(video => video.id !== videoId)
    isSaved.value = false
    console.log(savedStore.savedVideos)
}


const isChannelSaved = ref(savedChannelStore.isSaved(info.snippet.channelId))
const channelSave = function() {
    savedChannelStore.savedChannels.push(
        {
            id: info.snippet.channelId,
            title: info.snippet.channelTitle,
        }
    )
    isChannelSaved.value = true
    console.log(savedChannelStore.savedChannels)
}

const channelDel = function() {
    savedChannelStore.savedChannels = savedChannelStore.savedChannels.filter(channel => channel.id !== info.snippet.channelId)
    isChannelSaved.value = false
    console.log(savedChannelStore.savedChannels)
}

</script>

<style scoped>
</style>
<template>
    <div>
        <h1>게시글 목록</h1>
        <ArticleCard
        v-for="article in articles" :key="article.id" :article="article" />
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ArticleCard from '@/components/ArticleCard.vue'

const articles = ref([])

onMounted(() => {
    axios.get('http://localhost:8000/api/v1/articles/')
        .then(response => {
            articles.value = response.data
        })
        .catch((err) => console.log(err))
})
</script>

<style scoped>

</style>
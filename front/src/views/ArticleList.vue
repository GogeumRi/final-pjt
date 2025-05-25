<template>
    <div>
        <h1>게시글 목록</h1>
        <ArticleCard
        v-for="article in articleStore.articles" :key="article.id" :article="article" />
    </div>

</template>

<script setup>
import { onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/ArticleCard.vue'

const articleStore = useArticleStore()

onMounted(() => {
    if (articleStore.articles.length === 0) {
        articleStore.fetchArticles()
    }
})
</script>

<style scoped>

</style>
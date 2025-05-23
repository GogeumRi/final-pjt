<template>
    <div>
        <h1>게시글 목록</h1>
        <ArticleCard
        v-for="article in articleStore.articles" :key="article.id" :articleId="article.id" />
    </div>

</template>

<script setup>
import { onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/ArticleCard.vue'

const articleStore = useArticleStore()

onMounted(() => {
    articleStore.fetchArticles()
})
</script>

<style scoped>

</style>
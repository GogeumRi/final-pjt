<template>
    <main class="container">
    <h1 class="my-3">게시글</h1>
    <hr>
    <article>
        <h5>게시글 목록</h5>
        <hr>
        <ArticleCard
        v-for="article in articleStore.articles" :key="article.id" :article="article" />
    </article>
    </main>

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
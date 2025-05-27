<template>
    <main class="container">
    <h1 class="my-3">자유게시판</h1>
    <hr>
    <article>
        <div class="d-flex justify-content-between align-items-center my-3">
            <h5 class="mb-0">게시글 목록</h5>
            <RouterLink v-if="authStore.isAuthenticated" to="/articles/create" class="btn btn-primary">게시글 작성</RouterLink>
        </div>
        <hr>
            <ArticleCard
            v-for="article in articleStore.articles" :key="article.id" :article="article" />
            <div>
                <p v-if="articleStore.articles.length === 0">게시글이 없습니다.</p>
            </div>
    </article>
    </main>

</template>

<script setup>
import { onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/ArticleCard.vue'
import { useAuthStore } from '@/stores/auth'

const articleStore = useArticleStore()
const authStore = useAuthStore()

onMounted(() => {
    if (articleStore.articles.length == 0) {
        articleStore.fetchArticles()
    }
    articleStore.fetchArticles()
})

</script>

<style scoped>

</style>
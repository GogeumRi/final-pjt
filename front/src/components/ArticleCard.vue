<template>
<div v-if="article" class="article-card">
    <h3>{{ article.title }}</h3>
    <p>작성자: {{ article.user }}</p>
    <p class="article-content" v-html="htmlContent"></p>
    <RouterLink :to="`/articles/${article.id}`" class="detail-link">상세 페이지</RouterLink>
    <button @click="onToggleLike">
        <div v-if="article.is_liked">
            ❤️ 취소 ({{ article.like_count }})
        </div>
        <div v-else>
            ❤️ ({{ article.like_count }})
        </div>
    </button>

</div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { computed } from 'vue'

const articleStore = useArticleStore()
// console.log(articleStore.articles)
const props = defineProps({
    article: Object,
})
const htmlContent = computed(() => {
    return props.article.content.replace(/(?:\r\n|\r|\n)/g, '<br />')
})
const onToggleLike = () => {
    articleStore.likeArticle(props.article.id)
}
</script>

<style scoped>
.article-card {
background-color: #fff;
border-radius: 12px;
padding: 1.25rem 1.5rem;
box-shadow: 0 2px 8px rgb(0 0 0 / 0.12);
margin-bottom: 1rem;
transition: box-shadow 0.3s ease;
}

.article-card:hover {
box-shadow: 0 6px 20px rgb(0 0 0 / 0.15);
}

.article-content {
    white-space: pre-wrap;
}

.title {
font-weight: 700;
font-size: 1.4rem;
margin-bottom: 0.5rem;
color: #1f2937; /* Gray-800 */
}

.content {
color: #4b5563; /* Gray-600 */
margin-bottom: 1rem;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.detail-link {
font-weight: 600;
color: #3b82f6; /* Blue-500 */
text-decoration: none;
}

.detail-link:hover {
text-decoration: underline;
}
</style>
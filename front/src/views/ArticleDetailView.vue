<template>
    <div class="container my-5" v-if="article">
    <button @click="goBack" class="btn btn-outline-primary mb-3">게시글 목록</button>
        <div class="mb-4">
            <header class="mb-5 text-center">
                <h1 class="display-2 fw-bold text-primary">{{ article.title }}</h1>
                <p class="text-muted fs-5">작성자: {{ article.user }}</p>
                <hr class="my-4" />
            </header>
            <section class="content mb-5">
                <p class="fs-4 lh-lg" v-html="article.content"></p>
            </section>
            <div v-if="authStore.user && article.user === authStore.user.username">
                <section class="actions text-center mb-5">
                    <button @click="goToEdit" class="btn btn-lg btn-outline-secondary me-3">
                        수정
                    </button>
                    <button @click="deleteArticle" class="btn btn-lg btn-outline-danger">
                        삭제
                    </button>
                </section>
            </div>
        </div>
        <CommentList :articleId="Number(route.params.id)" />
        <CommentForm v-if="authStore.isAuthenticated" :articleId="Number(route.params.id)" />
    </div>

    <div v-else class="text-center my-5">
        <h2 class="text-muted">로딩 중...</h2>
    </div>
</template>

<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import CommentList from '@/components/CommentList.vue'
import CommentForm from '@/components/CommentForm.vue'


const route = useRoute()
const router = useRouter()
const article = ref(null)
const authStore = useAuthStore()

onMounted(() => {
    console.log(route.params.id)
    axios.get(`api/v1/articles/${route.params.id}/`)
        .then((res) => {
            console.log(res.data)
            article.value = res.data
            article.value.content = article.value.content.replace(/(?:\r\n|\r|\n)/g, '<br />')
        })
        .catch((err) => {
            console.log(err)
        })
})

const goToEdit = () => {
    router.push(`/articles/${article.value.id}/edit`)
}

const deleteArticle = () => {
    axios.delete(`api/v1/articles/${article.value.id}/`, {
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    })
        .then(() => {
            router.push('/articles')
        })
}

const goBack = () => {
    router.push('/articles')
}
</script>

<style scoped>
.article-detail header h1 {
  /* 제목 크기 및 강조 */
  font-size: 3rem;
}

.article-detail .content p {
  /* 내용 가독성 향상 */
  font-size: 1.25rem;
  line-height: 1.8;
}

.article-detail .actions .btn {
  /* 버튼 크기 및 패딩 */
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
</style>

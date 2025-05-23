<template>
    <div v-if="article">
        <h1>{{ article.title }}</h1>
        <p>작성자: {{ article.user }}</p>
        <p>{{ article.content }}</p>
        <div v-if="authStore.user && article.user === authStore.user.username">
            <button @click="goToEdit">수정</button>
            <button @click="deleteArticle">삭제</button>
        </div>
    </div>
    <div v-else>
        <h1>로딩 중...</h1>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const authStore = useAuthStore()

onMounted(() => {
    console.log(route.params.id)
    axios.get(`http://localhost:8000/api/v1/articles/${route.params.id}/`)
    .then((res) => {
        article.value = res.data
    })
    .catch((err) => {
        console.log(err)
    })
})

const goToEdit = () => {
    router.push(`/articles/${article.value.id}/edit`)
}

const deleteArticle = () => {
    axios.delete(`http://localhost:8000/api/v1/articles/${article.value.id}/`, {
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    })
    .then(() => {
        router.push('/articles')
    })
}
</script>

<style scoped>

</style>
<template>
    <div class="write-container">
        <h1>게시글 수정</h1>
        <form @submit.prevent="editArticle" class="write-form">
            <input type="text" id="title" v-model="form.title" required class="input-title">
            <textarea id="content" v-model="form.content" required class="input-content"></textarea>
            <button type="submit" class="btn-submit">수정</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article.js'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const form = ref({
    title: '',
    content: ''
})


onMounted(() => {
    const articleId = Number(route.params.id)
    axios.get(`http://localhost:8000/api/v1/articles/${articleId}/`)
    .then((res) => {
        form.value.title = res.data.title
        form.value.content = res.data.content
    })
    .catch((err) => {
        console.log(err)
    })
})

const editArticle = () => {
    const articleId = route.params.id
    const updatedArticle = {
        title: title.value,
        content: content.value
    }
    articleStore.updateArticle(articleId, updatedArticle)
    router.push(`/articles/${articleId}`)
}

</script>

<style scoped>
.write-container {
max-width: 600px;
margin: 2rem auto;
padding: 1.5rem;
border-radius: 12px;
box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
background-color: #fff;
}

.write-form {
display: flex;
flex-direction: column;
gap: 1rem;
}

.input-title {
font-size: 1.2rem;
padding: 0.75rem 1rem;
border-radius: 8px;
border: 1px solid #ccc;
}

.input-content {
min-height: 150px;
padding: 1rem;
border-radius: 8px;
border: 1px solid #ccc;
resize: vertical;
}

.btn-submit {
background-color: #4f46e5; /* Indigo-600 */
color: white;
font-weight: 600;
padding: 0.75rem 1rem;
border: none;
border-radius: 8px;
cursor: pointer;
transition: background-color 0.25s ease;
}

.btn-submit:hover {
background-color: #4338ca; /* Indigo-700 */
}
</style>


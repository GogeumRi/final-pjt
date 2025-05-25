<template>
    <div class="write-container">
        <h1>게시글 작성</h1>
            <form @submit.prevent="createArticle" class="write-form">
                <input type="text" v-model="title" placeholder="제목" required class="input-title" />
                <textarea v-model="content" placeholder="내용" required class="input-content"></textarea>
                <button type="submit" class="btn-submit">작성</button>
            </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const title = ref('')
const content = ref('')

const createArticle = () => {
    axios.post('http://localhost:8000/api/v1/articles/', {
        title: title.value,
        content: content.value,
    }, {
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    })
    .then((res) => {
        router.push(`/articles/`)
    })
    .catch((err) => console.log(err))
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
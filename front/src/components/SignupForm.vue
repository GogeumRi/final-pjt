<template>
    <div>
        <form @submit.prevent="signup">
            <div>
                <label for="username">아이디: </label>
                <input type="text" id="username" v-model="username" />
            </div>
            <div>
                <label for="password1">비밀번호: </label>
                <input type="password" id="password1" v-model="password1" />
            </div>
            <div>
                <label for="password2">비밀번호 확인: </label>
                <input type="password" id="password2" v-model="password2" />
            </div>
            <div>
                <label for="email">이메일: </label>
                <input type="email" id="email" v-model="email" />
            </div>
            <button type="submit">회원가입</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const path = sessionStorage.getItem("CURRENT_PATH");

const username = ref('')
const password1 = ref('')
const password2 = ref('')
const email = ref('')

const signup = () => {
    if (password1.value !== password2.value) {
        alert("비밀번호가 일치하지 않습니다.")
        return
    }

    axios({
        method: 'POST',
        url: 'accounts/signup/',
        data: {
            username: username.value,
            password1: password1.value,
            password2: password2.value,
            email: email.value,
        },
    })
        .then((res) => {
            console.log(res)  // 전체 응답 확인
            const token = res.data.key
            authStore.setAuth(token)
            if (path === null) {
                router.push('/')
            } else {
            sessionStorage.removeItem("CURRENT_PATH");
            router.push({path: path})
            }
        })
        .catch((err) => {
            console.log(err.response)
            if (err.response && err.response.data && err.response.data.email) {
                alert(err.response.data.email[0])
            } else {
                alert("회원가입에 실패했습니다.")
            }
        })

}
</script>

<style scoped>
div {
    max-width: 500px;
    margin: 4rem auto;
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

form div {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #ced4da;
}

button {
    width: 100%;
    padding: 0.6rem;
    background-color: #198754;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
}

button:hover {
    background-color: #157347;
}
</style>
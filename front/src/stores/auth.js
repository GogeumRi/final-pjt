import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useArticleStore } from './article'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null)
    const user = ref(null)  // ← 유저 정보 전체

    const isAuthenticated = computed(() => token.value !== null)

    function setAuth(newToken) {
        token.value = newToken
        // 헤더에 토큰 추가
        axios.defaults.headers.common['Authorization'] = `Token ${newToken}`
        // 이후 프로필 가져오기
        axios.get('http://127.0.0.1:8000/accounts/user/')
            .then((res) => {
                user.value = res.data
            })
            .catch((err) => {
                console.error('프로필 요청 실패:', err)
            })
    }

    function login(username, password) {
        return axios.post('http://127.0.0.1:8000/accounts/login/', {
            username,
            password,
        })
            .then(res => {
                const token = res.data.key
                setAuth(token)
                const articleStore = useArticleStore()
                return articleStore.fetchArticles()
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }

    function logout() {
        token.value = null
        user.value = null
        axios.defaults.headers.common['Authorization'] = null
        const articleStore = useArticleStore()
        articleStore.articles = []
    }

    return {
        token,
        user,
        isAuthenticated,
        setAuth,
        login,
        logout,
    }
})

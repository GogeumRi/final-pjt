import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useArticleStore } from './article'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null)
    const user = ref(null)  // ← 유저 정보 전체
    const prdt_list = ref([])

    function joinPrdt(prdt) {
        prdt_list.value.push(prdt)
    }

    function disjoinPrdt(prdt) {
        for (let i = 0; i < prdt_list.value.length; i++) {
            if (prdt_list.value[i] === prdt) {
                prdt_list.value.splice(i, 1);
                i--
            }
        }
    }

    const isAuthenticated = computed(() => token.value !== null)

    function setAuth(newToken) {
        token.value = newToken
        // 헤더에 토큰 추가
        axios.defaults.headers.common['Authorization'] = `Token ${newToken}`
        // 이후 프로필 가져오기
        axios.get('accounts/user/')
            .then((res) => {
                user.value = res.data
                getPrdt(res.data.pk)
            })
            .catch((err) => {
                console.error('프로필 요청 실패:', err)
            })
    }

    function getPrdt() {
        return axios.get("accounts/interest/", {
            headers: {
                Authorization: `Token ${token.value}`
            }
        })
        .then((res) => {
            prdt_list.value = res.data.subscribed
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function login(username, password) {
        return axios.post('accounts/login/', {
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
        prdt_list.value = []
        axios.defaults.headers.common['Authorization'] = null
        const articleStore = useArticleStore()
        articleStore.articles = []
    }

    return {
        token,
        user,
        prdt_list,
        isAuthenticated,
        setAuth,
        getPrdt,
        joinPrdt,
        disjoinPrdt,
        login,
        logout,
    }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null)
    const user = ref(null)  // ← 유저 정보 전체

    const isAuthenticated = computed(() => token.value !== null)

    function setAuth(newToken) {
        token.value = newToken
        // 이후 프로필 요청
        axios.get('http://127.0.0.1:8000/accounts/user/', {
            headers: {
                Authorization: `Token ${newToken}`,
            },
        })
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
                return res
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }

    function logout() {
        token.value = null
        user.value = null
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

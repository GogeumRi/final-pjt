import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null)
    const user = ref(null)  // ← 유저 정보 전체
    const prdt_list = ref([])

    function joinPrdt(prdt) {
        prdt_list.value.push(prdt)
        console.log(prdt_list.value)
    }

    function disjoinPrdt(prdt) {
        for (let i = 0; i < prdt_list.value.length; i++) {
            if (prdt_list.value[i] === prdt) {
                prdt_list.value.splice(i, 1);
                i--
            }
        }
        console.log(prdt_list.value)
    }

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
                getPrdt(res.data.pk)
                console.log(res.data)
            })
            .catch((err) => {
                console.error('프로필 요청 실패:', err)
            })
    }

    function getPrdt() {
        return axios.get("http://127.0.0.1:8000/accounts/interest/", {
            headers: {
                Authorization: `Token ${token.value}`
            }
        })
        .then((res) => {
            prdt_list.value = res.data.subscribed
            console.log(prdt_list.value)
        })
        .catch((err) => {
            console.log(err)
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
        prdt_list.value = []
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

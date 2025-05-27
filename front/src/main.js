// console.log('main.js loaded')
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import { useKakao } from 'vue3-kakao-maps/@utils';
const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY

axios.defaults.baseURL = import.meta.env.VITE_API_URL
const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(useKakao(KAKAO_KEY, ['clusterer', 'services', 'drawing']))
app.config.globalProperties.axios = axios
app.mount('#app')

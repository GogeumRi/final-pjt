// console.log('main.js loaded')
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useKakao } from 'vue3-kakao-maps/@utils';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(useKakao('7ad91c791fea4455cf37d83fa4418dbc', ['clusterer', 'services', 'drawing']))

app.mount('#app')

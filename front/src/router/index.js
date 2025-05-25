import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InterestView from '@/views/InterestView.vue'
import SpotView from '@/views/SpotView.vue'
import VideoView from '@/views/VideoView.vue'
import SignupView from '../views/SignupView.vue'
import SigninView from '../views/SignInView.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleCreateView from '../views/ArticleCreateView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/interest',
      name: 'interest',
      component: InterestView,
    },
    {
      path: '/spot',
      name: 'spot',
      component: SpotView,
    },
    {
      path: '/video',
      name: 'video',
      component: VideoView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView,
    },
    {
      path: '/articles',
      name: 'articleList',
      component: ArticleList,
    },
    {
      path: '/articles/create',
      name: 'articleCreate',
      component: ArticleCreateView,
    },
  ],
})

export default router

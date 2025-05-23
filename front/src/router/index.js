import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InterestInfoView from '@/views/InterestInfoView.vue'
import SignupView from '../views/SignupView.vue'
import SigninView from '../views/SignInView.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleCreateView from '../views/ArticleCreateView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/interest_info',
      name: 'interest-info',
      component: InterestInfoView,
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
    {
      path: '/articles/:id',
      name: 'articleDetail',
      component: ArticleDetailView,
    },
  ],
})

export default router

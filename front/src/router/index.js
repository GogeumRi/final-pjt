import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InterestView from '@/views/InterestView.vue'
import SpotView from '@/views/SpotView.vue'
import VideoView from '@/views/VideoView.vue'
import MapView from '@/views/MapView.vue'
import SignupView from '../views/SignupView.vue'
import SigninView from '../views/SignInView.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleCreateView from '../views/ArticleCreateView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticleEditView from '../views/ArticleEditView.vue'
import ProfileView from '../views/ProfileView.vue'
import RecommendView from '@/views/RecommendView.vue'
import { useAuthStore } from '@/stores/auth'

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
      path: '/map',
      name: 'map',
      component: MapView,
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
        beforeEnter(to, from, next) {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
          sessionStorage.setItem("CURRENT_PATH", to.path)
          swal('로그인이 필요합니다.', '', 'warning')
          next({name:'signin'})
        } else{
          next();
        }}
    },
    {
      path: '/articles/:id',
      name: 'articleDetail',
      component: ArticleDetailView,
    },
    {
      path: '/articles/:id/edit',
      name: 'articleEdit',
      component: ArticleEditView,
        beforeEnter(to, from, next) {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
          sessionStorage.setItem("CURRENT_PATH", to.path)
          swal('로그인이 필요합니다.', '', 'warning')
          next({name:'signin'})
        } else{
          next();
        }}
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
        beforeEnter(to, from, next) {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
          sessionStorage.setItem("CURRENT_PATH", to.path)
          swal('로그인이 필요합니다.', '', 'warning')
          next({name:'signin'})
        } else{
          next();
        }}
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: RecommendView,
      beforeEnter(to, from, next) {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
          sessionStorage.setItem("CURRENT_PATH", to.path)
          swal('로그인이 필요합니다.', '', 'warning')
          next({name:'signin'})
        } else{
          next();
        }}
    },
  ],
})

export default router

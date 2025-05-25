import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: [],
    }),
    actions: {
        fetchArticles() {
            axios.get('http://localhost:8000/api/v1/articles/')
            .then((res) => {
                this.articles = res.data
            })
            .catch((err) => {
                console.log(err)
            })
        },
        getArticle(articleId) {
            return this.articles.find((article) => article.id === articleId)
        },
        updateArticle(articleId, updatedArticle) {
            axios.put(`http://localhost:8000/api/v1/articles/${articleId}/`, updatedArticle)
            .then((res) => {
                const index = this.articles.findIndex((article) => article.id === articleId)
                this.articles[index] = res.data
            })
        },
        likeArticle(articleId) {
            const authStore = useAuthStore()
            axios({
                method: 'post',
                url: `http://localhost:8000/api/v1/articles/${articleId}/like/`,
                headers: {
                    Authorization: `Token ${authStore.token}`,
                },
            })
            .then((res) => {
                const updated = res.data
                console.log(updated)
                const index = this.articles.findIndex((article) => article.id === articleId)
                console.log(index)
                if (index !== -1) {
                    this.articles.splice(index, 1, updated)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
    },
})
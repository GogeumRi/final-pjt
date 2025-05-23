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
                const index = this.articles.findIndex((article) => article.id === articleId)
                if (index !== -1) {
                    const updatedArticle = {
                        ...this.articles[index],
                        like_count: updated.like_count,
                        like_users: updated.like_users,
                    }
                    this.articles = [
                        ...this.articles.slice(0, index),
                        updatedArticle,
                        ...this.articles.slice(index + 1),
                    ]
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
    },
})
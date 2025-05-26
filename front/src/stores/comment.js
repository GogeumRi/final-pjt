import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'


export const useCommentStore = defineStore('comment', {
    state: () => ({
        comments: [],
    }),
    actions: {
        fetchComments(articleId) {
            axios.get(`api/v1/articles/${articleId}/comments/`)
            .then((res) => {
                this.comments = res.data
            })
            .catch((err) => {
                console.log(err)
            })
        },
        createComment(articleId, commentData) {
            const authStore = useAuthStore()
            axios.post(`api/v1/articles/${articleId}/comments/`, commentData,
                {  
                    headers: {
                        'Authorization': `Token ${authStore.token}`
                    }
                }
            )
            .then((res) => {
                this.comments.push(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        deleteComment(articleId, commentId) {
            const authStore = useAuthStore()
            axios.delete(`api/v1/articles/${articleId}/comments/${commentId}/`,
                {
                    headers: {
                        'Authorization': `Token ${authStore.token}`
                    }
                }
            )
            .then(() => {
                this.comments = this.comments.filter((comment) => comment.id !== commentId)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        likeComment(articleId, commentId) {
            const authStore = useAuthStore()
            // console.log(authStore.token)
            axios.post(`api/v1/articles/${articleId}/comments/${commentId}/like/`,
                {},
                {
                    headers: {
                        'Authorization': `Token ${authStore.token}`
                    }
                })
            .then((res) => {
                this.comments = this.comments.map((comment) => comment.id === commentId ? res.data : comment)
            })
            .catch((err) => {
                console.log(err)
            })
        },
    },
})
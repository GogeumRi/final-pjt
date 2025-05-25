<template>
    <div class="comment-list">
      <h2 class="mb-4">댓글 목록</h2>
      <ul class="list-group">
        <li
          v-for="comment in commentStore.comments"
          :key="comment.id"
          class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start"
        >
          <div>
            <p class="mb-1"><strong>작성자:</strong> {{ comment.user }}</p>
            <p class="mb-2"><strong>댓글:</strong> {{ comment.content }}</p>
            <small class="text-muted">{{ comment.created_at }}</small>
          </div>
          <div class="mt-3 mt-md-0 d-flex gap-2">
            <button
              v-if="authStore.isAuthenticated"
              @click="commentStore.likeComment(props.articleId, comment.id)"
              class="btn btn-sm btn-outline-primary"
            >
              <span v-if="comment.is_liked">좋아요 취소 ({{ comment.like_count }})</span>
              <span v-else>좋아요 ({{ comment.like_count }})</span>
            </button>
            <button
              v-if="authStore.user && comment.user === authStore.user.username"
              @click="commentStore.deleteComment(props.articleId, comment.id)"
              class="btn btn-sm btn-outline-danger"
            >
              삭제
            </button>
          </div>
        </li>
      </ul>
    </div>
  </template>

<script setup>
import { useCommentStore } from '@/stores/comment'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const props = defineProps({
    articleId: {
        type: Number,
        required: true,
    },
})

const commentStore = useCommentStore()
const authStore = useAuthStore()

onMounted(() => {
    commentStore.fetchComments(props.articleId)
})
</script>

<style scoped>
.comment-list {
  margin-top: 2rem;
}
.list-group-item {
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f8f9fa;
}
.list-group-item p {
  margin: 0;
}
</style>
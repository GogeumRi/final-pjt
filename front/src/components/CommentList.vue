<template>
  <div class="comment-list">
    <h2 class="mb-4">댓글 목록</h2>
    <ul class="list-group">
      <li
        v-for="comment in commentStore.comments"
        :key="comment.id"
        class="list-group-item d-flex flex-column flex-md-row align-items-start"
      >
        <!-- flex-fill lets this div expand to fill available width -->
        <div class="flex-fill me-md-3">
          <p class="mb-1"><strong>작성자:</strong> {{ comment.user }}</p>
          <div v-if="!comment.isEditing">
            <p class="mb-2" v-html="comment.content.replace(/\n/g, '<br>')"></p>
          </div>
          <div v-else>
            <textarea
              v-model="comment.editedContent"
              class="form-control w-100"
              rows="4"
            ></textarea>
          </div>

          <small class="text-muted">생성 날짜: {{ comment.created_at.slice(0, 10) }}</small>
        </div>

        <div class="mt-3 mt-md-0 d-flex gap-2">
          <button
            v-if="authStore.user && comment.user === authStore.user.username && !comment.isEditing"
            @click='() => {
              comment.isEditing = true
              comment.editedContent = comment.content
            }'
            class="btn btn-sm btn-outline-secondary"
          >
            수정
          </button>
          <button
            v-else-if="comment.isEditing"
            @click='() => {
              commentStore.editComment(props.articleId, comment.id, comment.editedContent)
              .then(() => comment.isEditing = false)
            }'
            class="btn btn-sm btn-success"
          >
            저장
          </button>
          <button
            v-if="authStore.isAuthenticated"
            @click="commentStore.likeComment(props.articleId, comment.id)"
            class="btn btn-sm btn-outline-primary"
          >
            <span v-if="comment.is_liked">
              좋아요 취소 ({{ comment.like_count }})
            </span>
            <span v-else>
              좋아요 ({{ comment.like_count }})
            </span>
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
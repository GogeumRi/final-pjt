<template>
    <div class="comment-form mt-4">
      <form @submit.prevent="createComment" class="d-flex flex-column gap-2">
        <textarea
          v-model="comment"
          class="form-control form-control-lg"
          rows="4"
          placeholder="댓글을 입력하세요"
        ></textarea>
        <button type="submit" class="btn btn-primary align-self-end">
          댓글 작성
        </button>
      </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommentStore } from '@/stores/comment'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
    articleId: {
        type: Number,
        required: true,
    },
})

const commentStore = useCommentStore()
const authStore = useAuthStore()

const comment = ref('')

const createComment = () => {
    if (!comment.value) {
        alert('댓글을 입력해주세요')
        return
    }
    if (!authStore.isAuthenticated) {
        alert('로그인 후 댓글을 작성해주세요')
        return
    }
    commentStore.createComment(props.articleId, { content: comment.value })
    comment.value = ''
}

</script>


<style scoped>
.comment-form {
  width: 100%;
}
.form-control-lg {
  font-size: 1rem;
  padding: 0.75rem;
}
.btn-primary {
  padding: 0.5rem 1.5rem;
}
</style>

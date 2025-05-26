<template>
  <main class="container">
    <h1 class="my-3">내 프로필</h1>
    <hr>
      <h5>
        <a class="link-underline link-offset-2 link-underline-opacity-0" 
        :class="{ 'link-primary': InfoType, 'link-body-emphasis': !InfoType }" 
        @mouseover="underline" @mouseleave="clear" 
        @click.prevent="changeDefault">기본 정보</a> | 
        <a class="link-underline link-offset-2 link-underline-opacity-0" 
        :class="{ 'link-primary': !InfoType, 'link-body-emphasis': InfoType }" 
        @mouseover="underline" @mouseleave="clear" 
        @click.prevent="changeJoined">가입 상품 조회</a>
      </h5>
    <hr class="mb-4">

    <div v-show="InfoType">
      <ProfileEdit 
      v-for='field in fields'
      :key='field.key'
      :field='field'
      :value='profile[field.key]'
      @save="onSave"
      />
    </div>
    <div v-show="!InfoType">
      <ProfilePrdts 
      :joinedprdtid="JoinedPrdt"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import ProfileEdit from '@/components/ProfileEdit.vue'
import ProfilePrdts from '@/components/ProfilePrdts.vue'

const InfoType = ref(true)
const changeDefault = (() => InfoType.value = true)
const changeJoined = (() => InfoType.value = false)


const profileStore = useProfileStore()
const profile = reactive({
  nickname: '',
  age: '',
  current_assets: '',
  wage: '',
})

const authStore = useAuthStore()
const JoinedPrdt = authStore.prdt_list

const fields = [
  {
    label: '닉네임',
    key: 'nickname',
    type: 'text',
  },
  {
    label: '나이',
    key: 'age',
    type: 'number',
  },
  {
    label: '현재 자산',
    key: 'current_assets',
    type: 'number',
  },
  {
    label: '월급',
    key: 'wage',
    type: 'number',
  },
]

onMounted(async () => {
  const data = await profileStore.fetchProfile()
  Object.assign(profile, data)
})

const onSave = function({key, value}) {
  profileStore.updateProfile({[key]: value})
  .then((res) => {
    swal('수정 완료', '', 'success')
    profile[key] = res[key]
  })
  .catch((err) => {
    swal('수정 실패', '다시 시도해 주세요.', 'error')
    console.error(err)
  })
}

const underline = function () {
    event.target.classList.remove('link-underline-opacity-0')
    event.target.classList.add('link-underline-opacity-100')
}

const clear = function () {
    event.target.classList.remove('link-underline-opacity-100')
    event.target.classList.add('link-underline-opacity-0')
}

</script>

<style scoped>

</style>
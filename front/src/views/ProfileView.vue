<template>
  <div>
    <h1>내 프로필</h1>
    <ProfileEdit 
    v-for='field in fields'
    :key='field.key'
    :field='field'
    :value='profile[field.key]'
    @save="onSave"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import ProfileEdit from '@/components/ProfileEdit.vue'

const profileStore = useProfileStore()
const profile = reactive({
  nickname: '',
  age: '',
  current_assets: '',
  wage: '',
  subscribed_products: [],
  new_subscribed_products: [],
})

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
  {
    label: '구독 상품',
    key: 'subscribed_products',
    type: 'array',
  },
  {
    label: '새로운 구독 상품',
    key: 'new_subscribed_products',
    type: 'array',
  },
]

onMounted(async () => {
  const data = await profileStore.fetchProfile()
  Object.assign(profile, data)
})

const onSave = function({key, value}) {
  profileStore.updateProfile({[key]: value})
  .then((res) => {
    profile[key] = res[key]
  })
  .catch((err) => {
    console.error(err)
  })
}
</script>

<style scoped>

</style>
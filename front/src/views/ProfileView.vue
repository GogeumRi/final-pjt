<template>
    <div class="container my-5">
      <h1>내 프로필</h1>
      <form @submit.prevent="onSubmit" class="row g-3">
        <div class="col-md-6">
          <label>Email</label>
          <input v-model="form.email" type="email" class="form-control" />
        </div>
        <div class="col-md-6">
          <label>Nickname</label>
          <input v-model="form.nickname" type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>Age</label>
          <input v-model.number="form.age" type="number" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>Current Asset</label>
          <input
            v-model.number="form.current_asset"
            type="number" step="0.01"
            class="form-control"
          />
        </div>
        <div class="col-md-4">
          <label>Wage</label>
          <input
            v-model.number="form.wage"
            type="number" step="0.01"
            class="form-control"
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">저장</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted } from 'vue'
  import { useProfileStore } from '@/stores/profile'
  
  const store = useProfileStore()
  
  const form = reactive({
    email: '',
    nickname: '',
    age: null,
    current_asset: null,
    wage: null,
  })
  
  onMounted(async () => {
    const data = await store.fetchProfile()
    Object.assign(form, data)
  })
  
  function onSubmit() {
    store
      .updateProfile(form)
      .then(() => alert('프로필이 저장되었습니다!'))
      .catch(err => console.error(err))
  }
  </script>
  
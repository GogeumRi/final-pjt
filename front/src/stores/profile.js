import { defineStore } from 'pinia'
import axios from 'axios'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
  }),
  actions: {
    fetchProfile() {
      return axios
        .get('http://localhost:8000/accounts/profile/')
        .then(res => {
          this.profile = res.data
          return res.data
        })
    },
    updateProfile(data) {
      return axios
        .put('http://localhost:8000/accounts/profile/', data)
        .then(res => {
          this.profile = res.data
          return res.data
        })
    },
  },
})

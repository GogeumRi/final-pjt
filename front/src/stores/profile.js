import { defineStore } from 'pinia'
import axios from 'axios'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
  }),
  actions: {
    fetchProfile() {
      return axios
        .get('accounts/profile/')
        .then(res => {
          this.profile = res.data
          return res.data
        })
    },
    updateProfile(data) {
      return axios
        .put('accounts/profile/', data)
        .then(res => {
          this.profile = res.data
          return res.data
        })
    },
  },
})

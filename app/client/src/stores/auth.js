import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const mode = useLocalStorage('mode')
  const token = useLocalStorage('token')
  const user = ref(undefined)

  const isAuthenticated = computed(() => {
    return token.value !== undefined
  })

  const setAuth = ({ access_token, user: use }) => {
    mode.value = 'user'
    token.value = access_token
    user.value = use
  }

  const setUser = (use) => {
    user.value = use
  }

  const setGuestMode = () => {
    mode.value = 'guest'
    token.value = undefined
    user.value = undefined
  }

  const resetAuth = () => {
    mode.value = undefined
    token.value = undefined
    user.value = undefined
  }

  return {
    mode,
    token,
    user,
    isAuthenticated,
    setAuth,
    setUser,
    setGuestMode,
    resetAuth,
  }
})

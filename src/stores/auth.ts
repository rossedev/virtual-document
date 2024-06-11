import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  lastname: string
  email: string
  password: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null,
    isAuthenticated: !!localStorage.getItem('user')
  }),
  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify({ ...user, passoword: null }))
    },
    clearUser() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    }
  }
})

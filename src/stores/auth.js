import { defineStore } from 'pinia'
import * as authService from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('fiscalizai_token') || null,
    anonimo: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !state.anonimo,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    async login({ email, password }) {
      const { token } = await authService.login(email, password)
      this.setToken(token)
      try {
        this.user = await authService.perfilAtual()
        return this.user
      } catch (e) {
        this.logout()
        throw e
      }
    },
    async registrar({ email, password, phone }) {
      const { token } = await authService.registrar({ email, password, phone })
      this.setToken(token)
      this.user = await authService.perfilAtual()
      return this.user
    },
    async redefinirSenha(token, password) {
      const { token: novoToken } = await authService.redefinirSenha(token, password)
      this.setToken(novoToken)
      this.user = await authService.perfilAtual()
      return this.user
    },
    continuarAnonimo() {
      this.anonimo = true
      this.user = null
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('fiscalizai_token', token)
    },
    logout() {
      this.token = null
      this.user = null
      this.anonimo = false
      localStorage.removeItem('fiscalizai_token')
    },
  },
})

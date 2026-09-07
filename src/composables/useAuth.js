import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as authService from '@/services/auth'

export function useAuth() {
  const store = useAuthStore()

  const isLoggedIn = computed(() => store.isLoggedIn)
  const user = computed(() => store.user)

  async function login(credentials) {
    return store.login(credentials)
  }

  async function registrar(payload) {
    return store.registrar(payload)
  }

  function solicitarRecuperacaoSenha(email) {
    return authService.solicitarRecuperacaoSenha(email)
  }

  async function redefinirSenha(token, password) {
    return store.redefinirSenha(token, password)
  }

  function continuarAnonimo() {
    store.continuarAnonimo()
  }

  function logout() {
    store.logout()
  }

  return { isLoggedIn, user, login, registrar, solicitarRecuperacaoSenha, redefinirSenha, continuarAnonimo, logout }
}

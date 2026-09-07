import api from './api'

export function login(email, password) {
  return api.post('/auth/login', { email, password }).then((r) => r.data)
}

export function registrar(payload) {
  // payload: { email, password, phone }
  return api.post('/user', payload).then((r) => r.data)
}

export function solicitarRecuperacaoSenha(email) {
  return api.post('/auth/password/recovery', { email }).then((r) => r.data)
}

export function redefinirSenha(token, password) {
  return api.put(`/auth/password/reset?token=${encodeURIComponent(token)}`, { password }).then((r) => r.data)
}

export function perfilAtual() {
  return api.get('/user/me').then((r) => r.data)
}

export function estatisticasUsuario(city) {
  return api.get('/user/me/stats', { params: { city } }).then((r) => r.data)
}

export function atualizarUsuario(id, payload) {
  return api.put(`/user/${id}`, payload).then((r) => r.data)
}

export function excluirUsuario(id) {
  return api.delete(`/user/${id}`).then((r) => r.data)
}

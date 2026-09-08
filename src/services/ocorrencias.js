import api from './api'

export function listarOcorrencias(cityId) {
  const params = cityId ? { cityId } : {}
  return api.get('/issues', { params }).then((r) => r.data)
}

export function buscarOcorrencia(id) {
  return api.get(`/issues/${id}`).then((r) => r.data)
}

export function criarOcorrencia(payload) {
  // payload: { description, anonymous, category: {id}, severity: {id}, status: {id}, address, photo }
  return api.post('/issues', payload).then((r) => r.data)
}

export function atualizarOcorrencia(id, payload) {
  return api.put(`/issues/${id}`, payload).then((r) => r.data)
}

export function confirmarOcorrencia(id) {
  return api.put(`/issues/${id}/confirm`).then((r) => r.data)
}

export function marcarResolvida(id) {
  return api.put(`/issues/${id}/resolve`).then((r) => r.data)
}

export function buscarPorEndereco(params) {
  return api.get('/issues/address', { params }).then((r) => r.data)
}

export function uploadImagem(file) {
  const form = new FormData()
  form.append('file', file)
  return api
    .post('/issues/image/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data)
}

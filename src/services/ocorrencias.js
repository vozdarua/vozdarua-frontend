import api from './api'

export function listarOcorrencias(cityId, { page = 0, size = 500 } = {}) {
  // ponytail: size=500 cobre o mapa (precisa de tudo da cidade de uma vez);
  // sobe pra fetch-em-loop ou busca por viewport se uma cidade passar disso
  return api
    .get('/issues', { params: { page, size, ...(cityId ? { cityId } : {}) } })
    .then((r) => r.data.content)
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

export function metricasPorCidade(cityId, neighborhood) {
  return api
    .get('/issues/metrics', { params: { cityId, ...(neighborhood ? { neighborhood } : {}) } })
    .then((r) => r.data)
}

export function rankingContribuidores(cityId) {
  return api.get('/issues/ranking', { params: cityId ? { cityId } : {} }).then((r) => r.data)
}

export function uploadImagem(file) {
  const form = new FormData()
  form.append('file', file)
  return api
    .post('/issues/image/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data)
}

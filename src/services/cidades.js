import api from './api'

export function buscarCidades(params) {
  return api.get('/cities', { params }).then((r) => r.data)
}

export function rankingCidades() {
  return api.get('/cities/ranking').then((r) => r.data)
}

export function cidadesProximas(lat, lng) {
  return api.get('/location/cities/nearby', { params: { lat, lng } }).then((r) => r.data)
}

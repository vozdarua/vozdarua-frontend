import api from './api'

export function listarCategorias() {
  return api.get('/categories').then((r) => r.data)
}

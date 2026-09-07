import api from './api'

export async function listarComentarios(ocorrenciaId) {
  const { data } = await api.get(`/issues/${ocorrenciaId}/comments`)
  return data
}

export async function adicionarComentario(ocorrenciaId, texto) {
  const { data } = await api.post(`/issues/${ocorrenciaId}/comments`, { text: texto })
  return data
}

export async function deletarComentario(ocorrenciaId, comentarioId) {
  await api.delete(`/issues/${ocorrenciaId}/comments/${comentarioId}`)
}

import api from './api'

export function enviarFeedback({ tipo, mensagem, nome, email }) {
  return api
    .post('/feedback', { type: tipo.toUpperCase(), message: mensagem, name: nome || null, email: email || null })
    .then((r) => r.data)
}

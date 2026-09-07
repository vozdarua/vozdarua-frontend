import api from './api'

// Seeds conhecidos no ambiente de teste:
// severity: 1=Baixo, 2=Médio, 3=Alto
// status:   1=Aceito, 2=Resolvido, 3=Em análise, 4=Aberto

export function listarSeveridades() {
  return api.get('/severity').then((r) => r.data)
}

export function listarStatus() {
  return api.get('/status').then((r) => r.data)
}

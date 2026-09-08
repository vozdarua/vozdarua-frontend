import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Identifica este navegador para ações anônimas (confirmar/resolver ocorrência sem login),
// já que o backend precisa de alguma identidade estável para não deixar a mesma pessoa
// contar duas vezes. Persistido em localStorage: sobrevive a reloads, não a "modo anônimo"
// ou troca de navegador — mesmo teto de qualquer identificação sem conta.
function getAnonId() {
  try {
    let id = localStorage.getItem('vozdarua_anon_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('vozdarua_anon_id', id)
    }
    return id
  } catch {
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fiscalizai_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    const anonId = getAnonId()
    if (anonId) config.headers['X-Anon-Id'] = anonId
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fiscalizai_token')
      window.location.href = '/app/registrar'
    }
    return Promise.reject(err)
  }
)

export default api

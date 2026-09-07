import api from './api'

// A própria API resolve o CEP no backend — não é necessário chamar
// viacep.com.br diretamente do frontend.
export function buscarCep(cep) {
  const limpo = cep.replace(/\D/g, '')
  return api.get(`/location/cep/${limpo}`).then((r) => r.data)
}

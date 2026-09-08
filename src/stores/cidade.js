import { defineStore } from 'pinia'
import * as cidadesService from '@/services/cidades'

const CIDADE_PADRAO = { nome: 'São José dos Campos', uf: 'SP' }

export const useCidadeStore = defineStore('cidade', {
  state: () => ({
    // lat/lng aqui são só o chute inicial antes de qualquer geocode - a cidade real
    // vem da API (busca por nome + coordenadas resolvidas sob demanda ao selecionar).
    cidadeAtual: { id: null, nome: CIDADE_PADRAO.nome, uf: CIDADE_PADRAO.uf, lat: -23.2237, lng: -45.9009 },
  }),
  actions: {
    // Aceita tanto o shape de /cities (id, name, state.uf) quanto de
    // /location/cities/nearby (cityId, name, uf).
    selecionar(cidade) {
      this.cidadeAtual = {
        id: cidade.id ?? cidade.cityId,
        nome: cidade.name ?? cidade.nome,
        uf: cidade.uf ?? cidade.state?.uf,
        lat: null,
        lng: null,
      }
    },
    setCoordsAtual(lat, lng) {
      this.cidadeAtual = { ...this.cidadeAtual, lat, lng }
    },
    async init() {
      if (this.cidadeAtual.id) return
      const resultados = await cidadesService.buscarCidades({ search: CIDADE_PADRAO.nome })
      const match = resultados.find(c => c.state?.uf === CIDADE_PADRAO.uf) ?? resultados[0]
      if (match) this.cidadeAtual = { ...this.cidadeAtual, id: match.id, nome: match.name }
    },
  },
})

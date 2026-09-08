import { defineStore } from 'pinia'
import * as ocorrenciasService from '@/services/ocorrencias'
import { useAuthStore } from '@/stores/auth'

const STATUS_ABERTO_ID = 4
const SEVERIDADE_PADRAO_ID = 1 // Baixo

export const useOcorrenciasStore = defineStore('ocorrencias', {
  state: () => ({
    lista: [],
    filtros: { categoria: null, status: null },
    carregando: false,
    metricas: null,
    carregandoMetricas: false,
    selecionada: null,
    rascunho: {
      localizacao: null,
      foto: null, // dataURL para preview
      fotoArquivo: null, // File real, enviado no envio do rascunho
      categoria: null,
      descricao: '',
    },
  }),
  actions: {
    async carregar(cidade) {
      this.carregando = true
      try {
        this.lista = await ocorrenciasService.listarOcorrencias(cidade)
      } finally {
        this.carregando = false
      }
    },
    async carregarMetricas(cityId) {
      this.carregandoMetricas = true
      try {
        this.metricas = await ocorrenciasService.metricasPorCidade(cityId)
      } finally {
        this.carregandoMetricas = false
      }
    },
    selecionar(ocorrencia) {
      this.selecionada = ocorrencia
    },
    async enviarRascunho() {
      const auth = useAuthStore()
      let photo
      if (this.rascunho.fotoArquivo) {
        photo = await ocorrenciasService.uploadImagem(this.rascunho.fotoArquivo)
      }
      const loc = this.rascunho.localizacao || {}
      const payload = {
        description: this.rascunho.descricao,
        anonymous: auth.anonimo,
        category: { id: this.rascunho.categoria?.id },
        severity: { id: SEVERIDADE_PADRAO_ID },
        status: { id: STATUS_ABERTO_ID },
        address: {
          latitude: loc.lat,
          longitude: loc.lng,
          state: loc.estado,
          city: loc.cidade,
          neighborhood: loc.bairro,
          street: loc.rua,
          cep: loc.cep,
        },
        ...(photo ? { photo: { id: photo.id } } : {}),
      }
      const criada = await ocorrenciasService.criarOcorrencia(payload)
      this.resetRascunho()
      return criada
    },
    resetRascunho() {
      this.rascunho = { localizacao: null, foto: null, fotoArquivo: null, categoria: null, descricao: '' }
    },
  },
})

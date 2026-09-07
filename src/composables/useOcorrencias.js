import { computed } from 'vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

export function useOcorrencias() {
  const store = useOcorrenciasStore()

  const ocorrencias = computed(() => store.lista)
  const carregando = computed(() => store.carregando)

  async function carregar() {
    await store.carregar()
  }

  return { ocorrencias, carregando, carregar, store }
}

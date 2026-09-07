<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { CATEGORIAS } from '@/constants/categorias'
import * as categoriasService from '@/services/categorias'

const emit = defineEmits(['next'])
const ocorrencias = useOcorrenciasStore()

const busca = ref('')
// Lista local serve como fallback instantâneo; substituída pela API
// para garantir que o id usado na criação da ocorrência seja o real.
const categorias = ref(CATEGORIAS)

onMounted(async () => {
  try {
    const remotas = await categoriasService.listarCategorias()
    if (remotas?.length) {
      categorias.value = remotas.map((c) => ({ id: c.id, e: c.icon, l: c.name, ex: c.description, tags: c.tags || [] }))
    }
  } catch {
    // mantém a lista local em caso de falha
  }
})

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const resultados = computed(() => {
  if (!busca.value.trim()) return categorias.value
  const q = normalize(busca.value)
  return categorias.value.filter((cat) => {
    if (normalize(cat.l).includes(q)) return true
    return cat.tags.some((tag) => normalize(tag).includes(q))
  })
})

function selecionar(cat) {
  if (navigator.vibrate) navigator.vibrate(10)
  ocorrencias.rascunho.categoria = cat
  emit('next')
}
</script>

<template>
  <div class="flex flex-col gap-4 p-5">
    <h1 class="text-xl font-bold text-gray-800">Qual a categoria do problema?</h1>

    <input
      v-model="busca"
      type="text"
      placeholder="Buscar categoria (ex: buraco, lixo, luz...)"
      class="w-full rounded-xl border-1.5 border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-soft"
    />

    <div class="flex flex-col gap-2">
      <button
        v-for="cat in resultados"
        :key="cat.id"
        type="button"
        class="flex items-start gap-3 rounded-xl border border-gray-200 px-3.5 py-3 text-left transition-all duration-150 hover:border-teal hover:bg-teal-soft active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        @click="selecionar(cat)"
      >
        <span class="text-xl flex-shrink-0 mt-0.5">{{ cat.e }}</span>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-800 leading-snug">{{ cat.l }}</p>
          <p v-if="cat.ex" class="text-xs text-gray-400 mt-0.5 leading-snug">{{ cat.ex }}</p>
        </div>
      </button>
      <p v-if="!resultados.length" class="text-sm text-gray-400 text-center py-6">
        Nenhuma categoria encontrada
      </p>
    </div>

  </div>
</template>

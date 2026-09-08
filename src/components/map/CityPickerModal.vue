<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useCidadeStore } from '@/stores/cidade'
import { useGeolocationStore } from '@/stores/geolocation'
import { useGeolocation } from '@/composables/useGeolocation'
import * as cidadesService from '@/services/cidades'

const emit = defineEmits(['close'])

const cidadeStore = useCidadeStore()
const geolocationStore = useGeolocationStore()
const { geocodeAddress } = useGeolocation()

const busca = ref('')
const searchInput = ref(null)
const resultados = ref([])
const proximas = ref([])
let buscaTimeout = null

watch(busca, (q) => {
  clearTimeout(buscaTimeout)
  const termo = q.trim()
  if (!termo) {
    resultados.value = []
    return
  }
  buscaTimeout = setTimeout(() => {
    cidadesService.buscarCidades({ search: termo }).then((r) => { resultados.value = r }).catch(() => { resultados.value = [] })
  }, 300)
})

async function carregarProximas() {
  try {
    let lat = geolocationStore.permitido ? geolocationStore.lat : null
    let lng = geolocationStore.permitido ? geolocationStore.lng : null
    if (!lat || !lng) {
      const coords = await geocodeAddress({ cidade: cidadeStore.cidadeAtual.nome, estado: cidadeStore.cidadeAtual.uf })
      lat = coords.lat
      lng = coords.lng
    }
    proximas.value = await cidadesService.cidadesProximas(lat, lng)
  } catch {
    // Sem GPS e sem geocode possível - some a seção em vez de travar o modal.
    proximas.value = []
  }
}

function selecionar(cidade) {
  cidadeStore.selecionar(cidade)
  emit('close')
  geocodeAddress({ cidade: cidade.name ?? cidade.nome, estado: cidade.uf })
    .then(({ lat, lng }) => cidadeStore.setCoordsAtual(lat, lng))
    .catch(() => {}) // mantém o centro do mapa anterior, não é fatal
}

onMounted(async () => {
  await nextTick()
  searchInput.value?.focus()
  carregarProximas()
})
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-[3000] flex items-end lg:items-center justify-center"
    @click.self="emit('close')"
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

    <!-- Modal panel -->
    <div class="relative w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[85vh]">

      <!-- Handle (mobile) -->
      <div class="flex justify-center pt-3 pb-1 lg:hidden">
        <div class="w-10 h-1 rounded-full bg-gray-200" />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 class="text-lg font-bold text-gray-900">Selecionar cidade</h2>
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          @click="emit('close')"
          aria-label="Fechar"
        >✕</button>
      </div>

      <!-- Busca -->
      <div class="px-5 pb-3">
        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20 transition-all">
          <span class="text-gray-400 text-base flex-shrink-0">🔍</span>
          <input
            ref="searchInput"
            v-model="busca"
            type="text"
            placeholder="Buscar cidade..."
            class="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          />
          <button
            v-if="busca"
            type="button"
            class="text-gray-400 hover:text-gray-600 transition-colors text-xs"
            @click="busca = ''"
          >✕</button>
        </div>
      </div>

      <!-- Lista -->
      <div class="overflow-y-auto flex-1 px-3 pb-6">

        <!-- Resultados de busca -->
        <template v-if="busca.trim()">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">
            {{ resultados.length ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''}` : 'Nenhum resultado' }}
          </p>
          <div class="flex flex-col">
            <button
              v-for="cidade in resultados"
              :key="cidade.id"
              type="button"
              class="grid w-full px-3 py-3 rounded-2xl text-left transition-colors"
              style="grid-template-columns: 1.5rem 1fr auto"
              :class="cidade.id === cidadeStore.cidadeAtual.id ? 'bg-teal/10' : 'hover:bg-gray-50'"
              @click="selecionar(cidade)"
            >
              <span class="text-teal text-sm font-bold self-center">{{ cidade.id === cidadeStore.cidadeAtual.id ? '✓' : '' }}</span>
              <span class="text-sm self-center" :class="cidade.id === cidadeStore.cidadeAtual.id ? 'font-semibold text-teal' : 'text-gray-800'">{{ cidade.name }}</span>
              <span class="text-xs text-gray-400 font-medium self-center bg-gray-100 rounded px-1.5 py-0.5 ml-2">{{ cidade.state?.uf }}</span>
            </button>
          </div>
        </template>

        <!-- Estado padrão: cidade atual + próximas -->
        <template v-else>
          <!-- Cidade selecionada -->
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1 px-2">Selecionada</p>
          <button
            type="button"
            class="grid w-full px-3 py-3 rounded-2xl bg-teal/10 text-left mb-4"
            style="grid-template-columns: 1.5rem 1fr auto"
            @click="emit('close')"
          >
            <span class="text-teal text-sm font-bold self-center">✓</span>
            <span class="text-sm font-semibold text-teal self-center">{{ cidadeStore.cidadeAtual.nome }}</span>
            <span class="text-xs text-teal font-semibold self-center bg-teal/10 rounded px-1.5 py-0.5 ml-2">{{ cidadeStore.cidadeAtual.uf }}</span>
          </button>

          <!-- Cidades próximas -->
          <template v-if="proximas.length">
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1 px-2">Cidades próximas</p>
            <div class="flex flex-col">
              <button
                v-for="cidade in proximas"
                :key="cidade.cityId ?? cidade.name"
                type="button"
                class="grid w-full px-3 py-3 rounded-2xl text-left hover:bg-gray-50 transition-colors"
                style="grid-template-columns: 1.5rem 1fr auto"
                @click="selecionar(cidade)"
              >
                <span class="self-center" />
                <span class="text-sm text-gray-800 self-center">{{ cidade.name }}</span>
                <div class="flex items-center gap-1.5 ml-2 self-center">
                  <span class="text-xs text-gray-400">{{ cidade.distanceKm }} km</span>
                  <span class="text-xs text-gray-400 font-medium bg-gray-100 rounded px-1.5 py-0.5">{{ cidade.uf }}</span>
                </div>
              </button>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue'
import { useCidadeStore } from '@/stores/cidade'
import { useCityMetricsBreakdown } from '@/composables/useCityMetricsBreakdown'
import CityPickerModal from './CityPickerModal.vue'

const props = defineProps({
  metricas: { type: Object, default: null },
  carregando: { type: Boolean, default: false },
})

const cidadeStore = useCidadeStore()
const showModal = ref(false)

const { total, porStatus, taxaResolucao, porCategoria, porBairro } = useCityMetricsBreakdown(toRef(props, 'metricas'))

const maxCategoria = computed(() => porCategoria.value.length > 0 ? porCategoria.value[0][1] : 1)
const maxBairro    = computed(() => porBairro.value.length    > 0 ? porBairro.value[0][1]    : 1)
</script>

<template>
  <aside class="flex-col w-80 xl:w-96 border-l border-gray-100 bg-white overflow-y-auto">

    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
      <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-none mb-1">Você está em</p>
      <div class="flex items-center gap-2 mb-0.5">
        <span class="text-base font-bold text-gray-800">{{ cidadeStore.cidadeAtual.nome }}</span>
        <button
          type="button"
          class="text-[11px] font-semibold text-teal border border-teal/40 rounded-full px-2 py-0.5 hover:bg-teal/10 transition-colors leading-none"
          @click="showModal = true"
        ><span>trocar</span></button>
      </div>
      <p class="text-sm text-gray-500">
        <span v-if="carregando" class="animate-pulse">Carregando dados…</span>
        <span v-else>{{ total }} ocorrências registradas</span>
      </p>
    </div>

    <!-- Modal trocar cidade -->
    <CityPickerModal v-if="showModal" @close="showModal = false" />

    <!-- Skeleton -->
    <div v-if="carregando" class="flex flex-col gap-5 px-6 py-6">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="rounded-xl bg-gray-100 h-16 animate-pulse" />
      </div>
      <div v-for="i in 5" :key="i" class="flex flex-col gap-2 mt-2">
        <div class="h-3 bg-gray-100 rounded animate-pulse w-28" />
        <div class="h-2 bg-gray-100 rounded animate-pulse" />
        <div class="h-2 bg-gray-100 rounded animate-pulse w-3/4" />
      </div>
    </div>

    <div v-else class="flex flex-col gap-6 px-6 py-6">

      <!-- KPIs -->
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl bg-gray-50 border border-gray-100 p-4 flex flex-col gap-1">
          <span class="text-2xl font-extrabold text-gray-800">{{ total }}</span>
          <span class="text-sm text-gray-400">Total de ocorrências</span>
        </div>
        <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 flex flex-col gap-0.5">
          <span class="text-2xl font-extrabold text-emerald-600">{{ taxaResolucao }}%</span>
          <span class="text-sm text-emerald-500">Taxa de resolução</span>
        </div>
        <div class="rounded-xl bg-amber-50 border border-amber-100 p-3.5 flex flex-col gap-0.5">
          <span class="text-2xl font-extrabold text-amber-500">{{ porStatus['Aberto'] ?? 0 }}</span>
          <span class="text-sm text-amber-400">Em aberto</span>
        </div>
        <div class="rounded-xl bg-violet-50 border border-violet-100 p-3.5 flex flex-col gap-0.5">
          <span class="text-2xl font-extrabold text-violet-500">{{ porStatus['Em análise'] ?? 0 }}</span>
          <span class="text-sm text-violet-400">Em análise</span>
        </div>
      </div>

      <hr class="border-gray-100" />

      <!-- Categorias mais reportadas -->
      <div>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Categorias mais reportadas</h3>
        <div v-if="porCategoria.length > 0" class="flex flex-col gap-2">
          <div v-for="([nome, qtd], i) in porCategoria" :key="nome" class="flex items-center gap-3 py-1">
            <span class="text-xs font-bold text-gray-300 w-3 text-right flex-shrink-0">{{ i + 1 }}</span>
            <span class="text-sm text-gray-700 flex-1 truncate">{{ nome }}</span>
            <div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
              <div class="h-full rounded-full bg-teal transition-all duration-500" :style="{ width: `${(qtd / maxCategoria) * 100}%` }" />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-5 text-right flex-shrink-0">{{ qtd }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">Sem dados ainda</p>
      </div>

      <hr class="border-gray-100" />

      <!-- Bairros com mais ocorrências -->
      <div>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Bairros com mais ocorrências</h3>
        <div v-if="porBairro.length > 0" class="flex flex-col gap-2">
          <div v-for="([nome, qtd], i) in porBairro" :key="nome" class="flex items-center gap-3 py-1">
            <span class="text-xs font-bold text-gray-300 w-3 text-right flex-shrink-0">{{ i + 1 }}</span>
            <span class="text-sm text-gray-700 flex-1 truncate">{{ nome }}</span>
            <div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
              <div class="h-full rounded-full bg-violet-400 transition-all duration-500" :style="{ width: `${(qtd / maxBairro) * 100}%` }" />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-5 text-right flex-shrink-0">{{ qtd }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">Sem dados ainda</p>
      </div>

    </div>
  </aside>
</template>

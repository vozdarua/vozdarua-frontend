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
const expanded = ref(false)

const { total, porStatus, taxaResolucao, porCategoria, porBairro } = useCityMetricsBreakdown(toRef(props, 'metricas'))
const emAberto = computed(() => porStatus.value['Aberto'] ?? 0)
const emAnalise = computed(() => porStatus.value['Em análise'] ?? 0)

const maxCategoria = computed(() => porCategoria.value.length > 0 ? porCategoria.value[0][1] : 1)
const maxBairro    = computed(() => porBairro.value.length    > 0 ? porBairro.value[0][1]    : 1)

const startY = ref(null)
function onTouchStart(e) { startY.value = e.touches[0].clientY }
function onTouchEnd(e) {
  if (startY.value === null) return
  const delta = startY.value - e.changedTouches[0].clientY
  if (delta > 40) expanded.value = true
  else if (delta < -40) expanded.value = false
  startY.value = null
}
</script>

<template>
  <!-- Backdrop ao expandir -->
  <div
    v-if="expanded"
    class="fixed inset-0 bg-black/20 z-[1500]"
    @click="expanded = false"
  />

  <!-- Modal trocar cidade -->
  <CityPickerModal v-if="showModal" @close="showModal = false" />

  <!-- Bottom sheet com translateY para animação suave -->
  <div
    class="fixed bottom-16 left-0 right-0 z-[1600] bg-white rounded-t-2xl shadow-2xl flex flex-col"
    :style="{
      transform: expanded ? 'translateY(0)' : 'translateY(calc(100% - 10rem))',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      maxHeight: '80vh',
    }"
    role="region"
    aria-label="Métricas da cidade"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Handle / header -->
    <div
      class="flex flex-col items-center gap-1 px-5 pt-4 pb-4 cursor-pointer select-none flex-shrink-0"
      @click="expanded = !expanded"
      :aria-expanded="expanded"
      role="button"
      :aria-label="expanded ? 'Recolher painel de métricas' : 'Expandir painel de métricas'"
    >
      <div class="w-10 h-1 rounded-full bg-gray-300 mb-1" aria-hidden="true" />

      <!-- Linha 1: cidade + botão trocar + chevron -->
      <div class="flex items-center justify-between w-full">
        <div>
          <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-none mb-0.5">Você está em</p>
          <div class="flex items-center gap-2">
            <span class="text-base font-bold text-gray-800">{{ cidadeStore.cidadeAtual.nome }}</span>
            <button
              type="button"
              class="text-[11px] font-semibold text-teal border border-teal/40 rounded-full px-2 py-0.5 hover:bg-teal/10 transition-colors"
              @click.stop="showModal = true"
            >trocar</button>
          </div>
        </div>
        <span class="text-gray-400 transition-transform duration-300 text-sm" :class="expanded ? 'rotate-180' : ''" aria-hidden="true">▲</span>
      </div>

      <!-- Linha 2: KPIs -->
      <div class="grid grid-cols-4 gap-2 w-full mt-3">
        <div class="flex flex-col items-center bg-gray-100 rounded-2xl py-2.5 px-1 text-center">
          <p class="text-base font-extrabold text-gray-800 tabular-nums leading-none">
            <span v-if="carregando" class="animate-pulse">…</span>
            <span v-else>{{ total }}</span>
          </p>
          <p class="text-sm text-gray-500 leading-tight mt-1">ocorrências</p>
        </div>
        <div class="flex flex-col items-center bg-gray-100 rounded-2xl py-2.5 px-1 text-center">
          <p class="text-base font-extrabold text-emerald-600 tabular-nums leading-none">{{ taxaResolucao }}%</p>
          <p class="text-sm text-gray-500 leading-tight mt-1">resolvidas</p>
        </div>
        <div class="flex flex-col items-center bg-gray-100 rounded-2xl py-2.5 px-1 text-center">
          <p class="text-base font-extrabold text-amber-500 tabular-nums leading-none">{{ emAberto }}</p>
          <p class="text-sm text-gray-500 leading-tight mt-1">em aberto</p>
        </div>
        <div class="flex flex-col items-center bg-gray-100 rounded-2xl py-2.5 px-1 text-center">
          <p class="text-base font-extrabold text-violet-600 tabular-nums leading-none">{{ emAnalise }}</p>
          <p class="text-sm text-gray-500 leading-tight mt-1">em análise</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo expandido -->
    <div class="overflow-y-auto px-5 pb-10 flex flex-col gap-6 flex-1">
      <hr class="border-gray-100" />

      <!-- Skeleton enquanto carrega -->
      <template v-if="carregando">
        <div v-for="i in 3" :key="i" class="flex flex-col gap-2">
          <div class="h-3 bg-gray-100 rounded animate-pulse w-24" />
          <div class="h-2 bg-gray-100 rounded animate-pulse" />
          <div class="h-2 bg-gray-100 rounded animate-pulse w-3/4" />
        </div>
      </template>

      <template v-else>
        <!-- Ranking categorias -->
        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Categorias mais reportadas</h3>
          <div v-if="porCategoria.length > 0" class="flex flex-col gap-2">
            <div v-for="([nome, qtd], i) in porCategoria" :key="nome" class="flex items-center gap-3 py-1">
              <span class="text-xs font-bold text-gray-300 w-3 flex-shrink-0" aria-hidden="true">{{ i + 1 }}</span>
              <span class="text-sm text-gray-700 flex-1 truncate">{{ nome }}</span>
              <div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <div class="h-full rounded-full bg-teal transition-all duration-500" :style="{ width: `${(qtd / maxCategoria) * 100}%` }" />
              </div>
              <span class="text-sm font-semibold text-gray-700 w-5 text-right flex-shrink-0">{{ qtd }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">Sem dados ainda</p>
        </div>

        <!-- Bairros com mais ocorrências -->
        <div>
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Bairros com mais ocorrências</h3>
          <div v-if="porBairro.length > 0" class="flex flex-col gap-2">
            <div v-for="([nome, qtd], i) in porBairro" :key="nome" class="flex items-center gap-3 py-1">
              <span class="text-xs font-bold text-gray-300 w-3 flex-shrink-0" aria-hidden="true">{{ i + 1 }}</span>
              <span class="text-sm text-gray-700 flex-1 truncate">{{ nome }}</span>
              <div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <div class="h-full rounded-full bg-violet-400 transition-all duration-500" :style="{ width: `${(qtd / maxBairro) * 100}%` }" />
              </div>
              <span class="text-sm font-semibold text-gray-700 w-5 text-right flex-shrink-0">{{ qtd }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">Sem dados ainda</p>
        </div>
      </template>
    </div>
  </div>
</template>

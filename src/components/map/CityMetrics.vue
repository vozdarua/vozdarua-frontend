<script setup>
import { computed } from 'vue'

const props = defineProps({
  ocorrencias: { type: Array, default: () => [] },
  carregando: { type: Boolean, default: false },
})

const total = computed(() => props.ocorrencias.length)

const porStatus = computed(() => {
  const counts = {}
  for (const oc of props.ocorrencias) {
    const nome = oc.status?.name ?? 'Desconhecido'
    counts[nome] = (counts[nome] ?? 0) + 1
  }
  return counts
})

const resolvidas = computed(() => porStatus.value['Resolvido'] ?? 0)
const taxaResolucao = computed(() =>
  total.value > 0 ? Math.round((resolvidas.value / total.value) * 100) : 0
)

const porCategoria = computed(() => {
  const counts = {}
  for (const oc of props.ocorrencias) {
    const nome = oc.category?.name ?? 'Sem categoria'
    counts[nome] = (counts[nome] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
})

const porSeveridade = computed(() => {
  const order = ['Alto', 'Médio', 'Baixo']
  const counts = { Alto: 0, Médio: 0, Baixo: 0 }
  for (const oc of props.ocorrencias) {
    const nome = oc.severity?.name
    if (nome && counts[nome] !== undefined) counts[nome]++
  }
  return order.map(nome => ({ nome, total: counts[nome] }))
})

const STATUS_CFG = {
  Aberto:      { cor: '#f59e0b', bg: '#fef3c7', icon: '🔴' },
  'Em análise': { cor: '#8b5cf6', bg: '#ede9fe', icon: '🔵' },
  Aceito:      { cor: '#0d9488', bg: '#f0fdfa', icon: '🟢' },
  Resolvido:   { cor: '#10b981', bg: '#d1fae5', icon: '✅' },
}

const SEV_CFG = {
  Alto:  { cor: '#ef4444', bar: 'bg-red-400' },
  Médio: { cor: '#f59e0b', bar: 'bg-amber-400' },
  Baixo: { cor: '#10b981', bar: 'bg-emerald-400' },
}

const maxCategoria = computed(() =>
  porCategoria.value.length > 0 ? porCategoria.value[0][1] : 1
)
</script>

<template>
  <section class="w-full bg-gray-50 border-t border-gray-200">
    <!-- Header -->
    <div class="max-w-5xl mx-auto px-4 pt-6 pb-2">
      <div class="flex items-baseline justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-800">Painel da cidade</h2>
          <p class="text-xs text-gray-400 mt-0.5">São José dos Campos · dados em tempo real</p>
        </div>
        <span v-if="carregando" class="text-xs text-gray-400 animate-pulse">Carregando…</span>
        <span v-else class="text-xs text-gray-400">{{ total }} ocorrências</span>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-6">

      <!-- KPIs principais -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <span class="text-2xl font-extrabold text-gray-800">{{ total }}</span>
          <span class="text-xs text-gray-500">Total de ocorrências</span>
        </div>
        <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <span class="text-2xl font-extrabold text-emerald-500">{{ taxaResolucao }}%</span>
          <span class="text-xs text-gray-500">Taxa de resolução</span>
        </div>
        <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <span class="text-2xl font-extrabold text-amber-500">{{ porStatus['Aberto'] ?? 0 }}</span>
          <span class="text-xs text-gray-500">Em aberto</span>
        </div>
        <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
          <span class="text-2xl font-extrabold text-violet-500">{{ porStatus['Em análise'] ?? 0 }}</span>
          <span class="text-xs text-gray-500">Em análise</span>
        </div>
      </div>

      <!-- Status breakdown + Severidade -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Por status -->
        <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Por status</h3>
          <div class="flex flex-col gap-2">
            <div
              v-for="(qtd, nome) in porStatus"
              :key="nome"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ STATUS_CFG[nome]?.icon ?? '⚪' }}</span>
                <span class="text-sm text-gray-700">{{ nome }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{
                      width: total > 0 ? `${(qtd / total) * 100}%` : '0%',
                      background: STATUS_CFG[nome]?.cor ?? '#9ca3af',
                    }"
                  />
                </div>
                <span class="text-xs font-semibold text-gray-700 w-6 text-right">{{ qtd }}</span>
              </div>
            </div>
            <p v-if="Object.keys(porStatus).length === 0" class="text-xs text-gray-400">
              Sem dados ainda
            </p>
          </div>
        </div>

        <!-- Por severidade -->
        <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Por severidade</h3>
          <div class="flex flex-col gap-3">
            <div v-for="sev in porSeveridade" :key="sev.nome" class="flex flex-col gap-1">
              <div class="flex justify-between text-xs text-gray-600">
                <span>{{ sev.nome }}</span>
                <span class="font-semibold">{{ sev.total }}</span>
              </div>
              <div class="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="SEV_CFG[sev.nome]?.bar ?? 'bg-gray-300'"
                  :style="{ width: total > 0 ? `${(sev.total / total) * 100}%` : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ranking por categoria -->
      <div class="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Categorias mais reportadas
        </h3>
        <div v-if="porCategoria.length > 0" class="flex flex-col gap-2.5">
          <div
            v-for="([nome, qtd], i) in porCategoria"
            :key="nome"
            class="flex items-center gap-3"
          >
            <span class="text-xs font-bold text-gray-300 w-4">{{ i + 1 }}</span>
            <span class="text-sm text-gray-700 w-36 truncate">{{ nome }}</span>
            <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-teal transition-all"
                :style="{ width: `${(qtd / maxCategoria) * 100}%` }"
              />
            </div>
            <span class="text-xs font-semibold text-gray-600 w-6 text-right">{{ qtd }}</span>
          </div>
        </div>
        <p v-else class="text-xs text-gray-400">Sem dados ainda</p>
      </div>

    </div>

    <div class="h-6" />
  </section>
</template>

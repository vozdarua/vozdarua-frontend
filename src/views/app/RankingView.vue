<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCidadeStore } from '@/stores/cidade'
import * as cidadesService from '@/services/cidades'
import * as ocorrenciasService from '@/services/ocorrencias'

const cidadeStore = useCidadeStore()
const carregando = ref(true)

function carregarContribuidores(cityId) {
  return ocorrenciasService.rankingContribuidores(cityId).then((r) => { rankingContribuidoresRaw.value = r })
}

onMounted(async () => {
  await cidadeStore.init()
  Promise.all([
    carregarContribuidores(cidadeStore.cidadeAtual.id),
    cidadesService.rankingCidades().then((r) => { rankingCidadesRaw.value = r }),
  ]).finally(() => { carregando.value = false })
})

watch(() => cidadeStore.cidadeAtual.id, (id) => { if (id) carregarContribuidores(id).catch(() => {}) })

// Top contribuidores por número de ocorrências (agregado no backend via GET /issues/ranking)
const rankingContribuidoresRaw = ref([])
const rankingContribuidores = computed(() =>
  rankingContribuidoresRaw.value.map(c => ({
    id: c.id,
    nome: c.email, // já mascarado pelo backend
    total: c.total,
    taxaResolucao: c.total > 0 ? Math.round((c.resolved / c.total) * 100) : 0,
  }))
)

// Cidades com mais ocorrências (agregado no backend via GET /cities/ranking)
const rankingCidadesRaw = ref([])
const rankingCidades = computed(() =>
  rankingCidadesRaw.value.map(c => ({
    ...c,
    taxaResolucao: c.total > 0 ? Math.round((c.resolved / c.total) * 100) : 0,
  }))
)

const maxContrib = computed(() => rankingContribuidores.value[0]?.total ?? 1)
const maxCidade  = computed(() => rankingCidades.value[0]?.total ?? 1)

const medalhas = ['🥇', '🥈', '🥉']

function iniciais(nome) {
  return nome.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

const avatarColors = [
  'bg-teal text-white', 'bg-violet-500 text-white', 'bg-amber-400 text-white',
  'bg-rose-400 text-white', 'bg-sky-500 text-white', 'bg-emerald-500 text-white',
]
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto pb-6">

    <!-- Header -->
    <div class="px-5 pt-7 pb-4">
      <h1 class="text-xl font-bold text-gray-800">Ranking</h1>
      <p class="text-sm text-gray-400 mt-1">Baseado nas ocorrências registradas em {{ cidadeStore.cidadeAtual.nome }}</p>
    </div>

    <!-- Skeleton -->
    <template v-if="carregando">
      <div class="flex flex-col gap-3 px-5">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="w-8 h-5 bg-gray-100 rounded animate-pulse" />
          <div class="w-10 h-10 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
          <div class="flex-1 flex flex-col gap-1.5">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-32" />
            <div class="h-2 bg-gray-100 rounded animate-pulse w-20" />
          </div>
          <div class="w-8 h-4 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </template>

    <template v-else>

      <!-- ── Contribuidores ── -->
      <section class="px-5 mb-8">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Contribuidores</h2>

        <div v-if="rankingContribuidores.length === 0" class="text-center py-10">
          <p class="text-3xl mb-2">📍</p>
          <p class="text-sm text-gray-400">Nenhum contribuidor identificado ainda.</p>
          <p class="text-sm text-gray-300 mt-1">Ocorrências anônimas não entram no ranking.</p>
        </div>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="(usuario, i) in rankingContribuidores"
            :key="usuario.id"
            class="flex items-center gap-3 py-4 px-4 rounded-2xl transition-colors"
            :class="i === 0 ? 'bg-amber-50 border border-amber-100' : i === 1 ? 'bg-gray-50' : ''"
          >
            <!-- Posição -->
            <div class="w-7 text-center flex-shrink-0">
              <span v-if="i < 3" class="text-base leading-none">{{ medalhas[i] }}</span>
              <span v-else class="text-xs font-bold text-gray-400">{{ i + 1 }}</span>
            </div>

            <!-- Avatar -->
            <div
              class="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
              :class="avatarColors[i % avatarColors.length]"
            >
              {{ iniciais(usuario.nome) }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-base font-semibold text-gray-800 truncate">{{ usuario.nome }}</p>
              <!-- Barra de progresso relativa -->
              <div class="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden w-full max-w-[120px]">
                <div
                  class="h-full rounded-full bg-teal transition-all duration-500"
                  :style="{ width: `${(usuario.total / maxContrib) * 100}%` }"
                />
              </div>
            </div>

            <!-- Contadores -->
            <div class="text-right flex-shrink-0">
              <p class="text-base font-extrabold text-gray-800">{{ usuario.total }}</p>
              <p class="text-sm text-emerald-500 font-semibold">{{ usuario.taxaResolucao }}% ✓</p>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-gray-100 mx-5 mb-6" />

      <!-- ── Cidades ── -->
      <section class="px-5">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Cidades com mais ocorrências</h2>

        <div v-if="rankingCidades.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-400">Sem dados de localização disponíveis.</p>
        </div>

        <div v-else class="flex flex-col gap-1">
          <div v-for="(cidade, i) in rankingCidades" :key="cidade.cityId" class="flex items-center gap-3 py-2">
            <span class="text-xs font-bold text-gray-300 w-4 text-right flex-shrink-0">{{ i + 1 }}</span>
            <span class="text-sm text-gray-700 flex-1 truncate">{{ cidade.name }}</span>
            <div class="w-24 h-2 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
              <div
                class="h-full rounded-full bg-violet-400 transition-all duration-500"
                :style="{ width: `${(cidade.total / maxCidade) * 100}%` }"
              />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-6 text-right flex-shrink-0">{{ cidade.total }}</span>
            <span class="text-xs text-emerald-500 w-10 text-right flex-shrink-0">{{ cidade.taxaResolucao }}%✓</span>
          </div>
        </div>
      </section>

    </template>
  </div>
</template>

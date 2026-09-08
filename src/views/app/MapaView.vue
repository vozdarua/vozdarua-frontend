<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { useUiStore } from '@/stores/ui'
import { useCidadeStore } from '@/stores/cidade'
import OccurrenceMap from '@/components/map/OccurrenceMap.vue'
import MapDrawer from '@/components/map/MapDrawer.vue'
import LocationModal from '@/components/modals/LocationModal.vue'
import CityMetricsSheet from '@/components/map/CityMetricsSheet.vue'
import CityMetricsSidebar from '@/components/map/CityMetricsSidebar.vue'

const router = useRouter()
const ocorrencias = useOcorrenciasStore()
const ui = useUiStore()
const cidadeStore = useCidadeStore()

function selecionarPin(oc) {
  ocorrencias.selecionar(oc)
  ui.openDrawer()
}

const isMobile = ref(window.innerWidth < 1024)
function onResize() { isMobile.value = window.innerWidth < 1024 }

const mapCenter = ref([cidadeStore.cidadeAtual.lat, cidadeStore.cidadeAtual.lng])

watch(() => cidadeStore.cidadeAtual, (cidade) => {
  if (cidade.lat && cidade.lng) mapCenter.value = [cidade.lat, cidade.lng]
  ocorrencias.lista = []
  ocorrencias.carregar(cidade.id).catch(() => {})
})

onMounted(async () => {
  await cidadeStore.init()
  ocorrencias.carregar(cidadeStore.cidadeAtual.id).catch(() => {})
  window.addEventListener('resize', onResize)
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <div class="flex w-full h-[calc(100vh-116px)] lg:h-[calc(100vh-52px)]">

    <!-- Mapa: ocupa toda a largura no mobile, restante no desktop -->
    <div class="relative flex-1 min-w-0">
      <OccurrenceMap
        :ocorrencias="ocorrencias.lista"
        :selecionada="ocorrencias.selecionada"
        :center="mapCenter"
        @select-pin="selecionarPin"
      />
      <MapDrawer
        :ocorrencia="ocorrencias.selecionada"
        :lista="ocorrencias.lista"
        @navegar="(oc) => { ocorrencias.selecionar(oc) }"
      />
      <LocationModal />

      <!-- Botão flutuante registrar: só desktop -->
      <button
        type="button"
        class="hidden lg:flex absolute bottom-8 right-8 z-[1000] items-center gap-3 rounded-2xl bg-teal px-6 py-4 text-white font-bold shadow-xl shadow-teal/40 hover:bg-teal-dark hover:shadow-2xl hover:shadow-teal/50 hover:-translate-y-0.5 active:scale-95 active:shadow-lg transition-all duration-150"
        @click="router.push('/app/registrar')"
      >
        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-base leading-none font-extrabold">+</span>
        <span class="text-base">Registrar ocorrência</span>
      </button>

      <!-- Bottom sheet: só mobile -->
      <CityMetricsSheet
        v-if="isMobile"
        :ocorrencias="ocorrencias.lista"
        :carregando="ocorrencias.carregando"
      />
    </div>

    <!-- Painel lateral direito: só desktop -->
    <CityMetricsSidebar
      class="hidden lg:flex"
      :ocorrencias="ocorrencias.lista"
      :carregando="ocorrencias.carregando"
    />
  </div>
</template>

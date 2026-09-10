<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { useGeolocationStore } from '@/stores/geolocation'
import AppTopbar from '@/components/ui/AppTopbar.vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import StepLocalizacao from './StepLocalizacao.vue'
import StepFoto from './StepFoto.vue'
import StepCategoria from './StepCategoria.vue'
import StepDescricao from './StepDescricao.vue'
import StepConfirmacao from './StepConfirmacao.vue'
import StepCadastro from './StepCadastro.vue'
import StepSucesso from './StepSucesso.vue'

const STEPS = ['localizacao', 'foto', 'categoria', 'descricao', 'confirmacao', 'cadastro', 'sucesso']
const STEP_COMPONENTS = {
  localizacao: StepLocalizacao,
  foto: StepFoto,
  categoria: StepCategoria,
  descricao: StepDescricao,
  confirmacao: StepConfirmacao,
  cadastro: StepCadastro,
  sucesso: StepSucesso,
}

const router = useRouter()
const ocorrencias = useOcorrenciasStore()
const geo = useGeolocationStore()

const stepIndex = ref(0)
const currentStep = computed(() => STEPS[stepIndex.value])
const currentComponent = computed(() => STEP_COMPONENTS[currentStep.value])

// Centro do mapa: localização do rascunho ou São José dos Campos
const mapCenter = computed(() => {
  const loc = ocorrencias.rascunho.localizacao
  if (loc?.lat && loc?.lng) return [loc.lat, loc.lng]
  if (geo.lat && geo.lng) return [geo.lat, geo.lng]
  return [-23.2237, -45.9009]
})

const markerPos = computed(() => {
  const loc = ocorrencias.rascunho.localizacao
  if (loc?.lat && loc?.lng) return [loc.lat, loc.lng]
  if (geo.lat && geo.lng) return [geo.lat, geo.lng]
  return null
})

const mapInstance = ref(null)

function onMapReady(map) {
  mapInstance.value = map
}

watch(markerPos, (pos) => {
  try {
    if (pos && mapInstance.value) {
      mapInstance.value.flyTo(pos, 16, { duration: 1 })
    }
  } catch {}
})

function next() {
  if (stepIndex.value < STEPS.length - 1) stepIndex.value++
}

function back() {
  if (stepIndex.value > 0) {
    stepIndex.value--
  } else {
    router.push('/app/mapa')

  }
}

function finalizar() {
  router.push('/app/mapa')
}

function onMarkerDragEnd(e) {
  try {
    const pos = e.target.getLatLng()
    geo.setCoords({ lat: pos.lat, lng: pos.lng })
  } catch {}
}
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row">

    <!-- DESKTOP: mapa à esquerda (full height) -->
    <div class="hidden lg:block flex-1 relative">
      <LMap
        :zoom="13"
        :center="mapCenter"
        style="height: 100%; width: 100%"
        @ready="onMapReady"
      >
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LMarker v-if="markerPos" :lat-lng="markerPos" :draggable="true" @dragend="onMarkerDragEnd" />
      </LMap>
    </div>

    <!-- Painel do wizard (mobile: full screen | desktop: coluna direita) -->
    <div class="w-full lg:w-[420px] xl:w-[460px] flex flex-col h-full lg:h-screen lg:border-l border-gray-200 bg-white">
      <AppTopbar :show-back="true" title="Registrar ocorrência" @back="back" />

      <div class="flex-1 overflow-y-auto pb-20 lg:pb-0" :key="currentStep">
        <component :is="currentComponent" @next="next" @back="back" @finalizar="finalizar" />
      </div>
    </div>

  </div>
</template>

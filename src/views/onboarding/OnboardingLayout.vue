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

const STEP_LABELS = {
  localizacao: { num: 1, label: 'Localização',   title: 'Onde aconteceu?' },
  foto:        { num: 2, label: 'Foto',           title: 'Tem uma foto?' },
  categoria:   { num: 3, label: 'Categoria',      title: 'O que é isso?' },
  descricao:   { num: 4, label: 'Descrição',      title: 'Descreva o problema' },
  confirmacao: { num: 5, label: 'Confirmação',    title: 'Está tudo certo?' },
  cadastro:    { num: 6, label: 'Conta',          title: 'Quase lá!' },
  sucesso:     { num: 7, label: 'Concluído',      title: 'Registrado!' },
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

      <!-- Indicador de passo sobre o mapa -->
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow">
        <template v-for="(s, i) in STEPS.slice(0, -1)" :key="s">
          <div
            class="h-2 rounded-full transition-all"
            :class="[
              i < stepIndex ? 'bg-teal w-2' : i === stepIndex ? 'bg-teal w-5' : 'bg-gray-200 w-2'
            ]"
          />
        </template>
        <span class="ml-2 text-xs font-semibold text-gray-600">
          {{ STEP_LABELS[currentStep]?.label }}
        </span>
      </div>
    </div>

    <!-- Painel do wizard (mobile: full screen | desktop: coluna direita) -->
    <div class="w-full lg:w-[420px] xl:w-[460px] flex flex-col h-full lg:h-screen lg:border-l border-gray-200 bg-white">
      <AppTopbar :show-back="true" title="Registrar ocorrência" @back="back" />

      <!-- Stepper (mobile) -->
      <div class="lg:hidden px-5 py-3 border-b border-gray-100">
        <div class="flex items-center">
          <template v-for="(s, i) in STEPS.slice(0, -1)" :key="s">
            <!-- Círculo do passo -->
            <div class="flex flex-col items-center flex-shrink-0" style="min-width:28px">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                :class="
                  i < stepIndex ? 'bg-teal text-white' :
                  i === stepIndex ? 'bg-teal text-white ring-4 ring-teal/20' :
                  'bg-gray-100 text-gray-400'
                "
              >
                <span v-if="i < stepIndex">✓</span>
                <span v-else>{{ i + 1 }}</span>
              </div>
            </div>
            <!-- Linha conectora -->
            <div v-if="i < STEPS.slice(0, -1).length - 1" class="flex-1 h-0.5 mx-1 rounded-full transition-all duration-300"
              :class="i < stepIndex ? 'bg-teal' : 'bg-gray-200'"
            />
          </template>
        </div>
        <!-- Label do passo atual -->
        <p class="text-xs font-semibold text-teal mt-2 text-center tracking-wide">
          {{ STEP_LABELS[currentStep]?.label }}
        </p>
      </div>

      <div class="flex-1 overflow-y-auto pb-20 lg:pb-0" :key="currentStep">
        <component :is="currentComponent" @next="next" @back="back" @finalizar="finalizar" />
      </div>
    </div>

  </div>
</template>

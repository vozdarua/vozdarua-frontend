<script setup>
import { ref, onMounted } from 'vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits(['next'])
const ocorrencias = useOcorrenciasStore()

const preview = ref(ocorrencias.rascunho.foto || null)
const cameraInput = ref(null)
const galeriaInput = ref(null)

onMounted(() => {
  if (!preview.value) {
    setTimeout(() => galeriaInput.value?.click(), 300)
  }
})

function onArquivo(event) {
  const file = event.target.files?.[0]
  if (!file) return
  ocorrencias.rascunho.fotoArquivo = file
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = reader.result
    ocorrencias.rascunho.foto = reader.result
  }
  reader.readAsDataURL(file)
}

function trocarFoto() {
  galeriaInput.value?.click()
}

function continuar() {
  emit('next')
}
</script>

<template>
  <div class="flex flex-col gap-5 p-5">
    <h1 class="text-xl font-bold text-gray-800">Adicione uma foto</h1>

    <div v-if="!preview" class="flex flex-col gap-3">
      <button
        type="button"
        class="rounded-xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center gap-2 hover:border-teal"
        @click="cameraInput.click()"
      >
        <span class="text-3xl">📷</span>
        <span class="text-sm font-semibold text-gray-600">Tirar foto</span>
      </button>
      <button
        type="button"
        class="rounded-xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center gap-2 hover:border-teal"
        @click="galeriaInput.click()"
      >
        <span class="text-3xl">🖼️</span>
        <span class="text-sm font-semibold text-gray-600">Escolher da galeria</span>
      </button>
    </div>

    <div v-else class="flex flex-col gap-3">
      <img :src="preview" alt="Pré-visualização" class="w-full rounded-xl object-cover max-h-80" />
      <AppButton variant="outline" @click="trocarFoto">Trocar foto</AppButton>
    </div>

    <input ref="cameraInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onArquivo" />
    <input ref="galeriaInput" type="file" accept="image/*" class="hidden" @change="onArquivo" />

    <div class="sticky bottom-0 bg-white pt-3">
      <AppButton :disabled="!preview" @click="continuar">Continuar</AppButton>
    </div>
  </div>
</template>

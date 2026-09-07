<script setup>
import { computed } from 'vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits(['next'])
const ocorrencias = useOcorrenciasStore()

const rascunho = computed(() => ocorrencias.rascunho)
const enderecoResumo = computed(() => {
  const l = rascunho.value.localizacao
  if (!l) return ''
  return [l.rua, l.bairro, l.cidade, l.estado].filter(Boolean).join(', ')
})

function continuar() {
  emit('next')
}
</script>

<template>
  <div class="flex flex-col gap-5 p-5">
    <h1 class="text-xl font-bold text-gray-800">Confirme os dados</h1>

    <img v-if="rascunho.foto" :src="rascunho.foto" class="w-full rounded-xl object-cover max-h-56" />

    <div class="flex flex-col gap-3 text-sm">
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ rascunho.categoria?.e }}</span>
        <span class="font-semibold text-gray-700">{{ rascunho.categoria?.l }}</span>
      </div>
      <p class="text-gray-600">{{ rascunho.descricao }}</p>
      <p class="text-gray-400 text-xs">📍 {{ enderecoResumo }}</p>
    </div>

    <div class="sticky bottom-0 bg-white pt-3">
      <AppButton @click="continuar">Confirmar e continuar</AppButton>
    </div>
  </div>
</template>

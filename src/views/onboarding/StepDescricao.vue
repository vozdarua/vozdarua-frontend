<script setup>
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import AppButton from '@/components/ui/AppButton.vue'

const emit = defineEmits(['next'])
const ocorrencias = useOcorrenciasStore()

function continuar() {
  emit('next')
}
</script>

<template>
  <div class="flex flex-col gap-5 p-5">
    <h1 class="text-xl font-bold text-gray-800">Descreva o problema</h1>

    <textarea
      v-model="ocorrencias.rascunho.descricao"
      rows="6"
      placeholder="Conte com detalhes o que está acontecendo..."
      class="w-full resize-none rounded-xl border-1.5 border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-soft"
    />

    <div class="sticky bottom-0 bg-white pt-3 flex flex-col gap-2">
      <AppButton :disabled="!ocorrencias.rascunho.descricao?.trim()" @click="continuar">
        Continuar
      </AppButton>
      <button
        type="button"
        class="w-full py-3 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        @click="ocorrencias.rascunho.descricao = ''; continuar()"
      >Pular esta etapa</button>
    </div>
  </div>
</template>

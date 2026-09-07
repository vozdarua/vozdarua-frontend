<script setup>
import { computed } from 'vue'
import OccurrenceStatus from './OccurrenceStatus.vue'

const props = defineProps({
  ocorrencia: { type: Object, required: true },
})
defineEmits(['click'])

const enderecoResumo = computed(() => {
  const a = props.ocorrencia.address
  if (!a) return ''
  return [a.street, a.neighborhood, a.city].filter(Boolean).join(', ')
})

const dataResumo = computed(() => {
  if (!props.ocorrencia.createdAt) return ''
  return new Date(props.ocorrencia.createdAt).toLocaleDateString('pt-BR')
})

const severidadeBorda = computed(() => {
  const nome = props.ocorrencia.severity?.name
  if (nome === 'Alto') return 'border-l-red-400'
  if (nome === 'Médio') return 'border-l-amber-400'
  return 'border-l-emerald-300'
})
</script>

<template>
  <button
    type="button"
    class="flex gap-3 rounded-2xl border border-gray-100 border-l-4 bg-white px-4 py-3.5 text-left shadow-sm hover:shadow-md hover:border-teal transition-all duration-150 w-full min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
    :class="severidadeBorda"
    :aria-label="`Ocorrência: ${props.ocorrencia.description}. Status: ${props.ocorrencia.status?.name}`"
    @click="$emit('click', props.ocorrencia)"
  >
    <!-- Conteúdo principal -->
    <div class="flex-1 flex flex-col gap-1.5 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{{ props.ocorrencia.description }}</p>
        <OccurrenceStatus :status="props.ocorrencia.status" />
      </div>
      <p class="text-xs text-gray-500">📍 {{ enderecoResumo }}</p>
      <p class="text-xs text-gray-400">{{ dataResumo }}</p>
    </div>

    <!-- Thumbnail foto -->
    <img
      v-if="props.ocorrencia.photo?.url"
      :src="props.ocorrencia.photo.url"
      :alt="`Foto da ocorrência: ${props.ocorrencia.description}`"
      class="w-14 h-14 rounded-xl object-cover flex-shrink-0"
    />
    <div
      v-else
      class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl"
      aria-hidden="true"
    >
      {{ props.ocorrencia.category?.icon ?? '📋' }}
    </div>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as authService from '@/services/auth'
import OccurrenceStatus from '@/components/occurrence/OccurrenceStatus.vue'

const ocorrencias = ref([])
const carregando = ref(true)
const erro = ref(false)

onMounted(() => {
  authService.minhasOcorrencias()
    .then((data) => { ocorrencias.value = data })
    .catch(() => { erro.value = true })
    .finally(() => { carregando.value = false })
})
</script>

<template>
  <div class="flex flex-col gap-3 p-5">
    <h1 class="text-lg font-bold text-gray-800">Minhas ocorrências</h1>

    <div v-if="carregando" class="flex flex-col gap-3">
      <div class="rounded-xl bg-gray-100 h-16 animate-pulse" />
      <div class="rounded-xl bg-gray-100 h-16 animate-pulse" />
      <div class="rounded-xl bg-gray-100 h-16 animate-pulse" />
    </div>

    <p v-else-if="erro" class="text-sm text-red-500 text-center py-10">
      Não foi possível carregar suas ocorrências.
    </p>

    <p v-else-if="ocorrencias.length === 0" class="text-sm text-gray-400 text-center py-10">
      Você ainda não registrou nenhuma ocorrência.
    </p>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="item in ocorrencias"
        :key="item.id"
        class="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-2"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-medium text-gray-800">{{ item.category?.name }}</span>
          <OccurrenceStatus :status="item.status" />
        </div>
        <p class="text-sm text-gray-600">{{ item.description }}</p>
        <span class="text-xs text-gray-400">{{ new Date(item.createdAt).toLocaleDateString() }}</span>
      </div>
    </div>
  </div>
</template>

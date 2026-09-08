<script setup>
import { ref, onMounted } from 'vue'
import * as authService from '@/services/auth'
import OccurrenceStatus from '@/components/occurrence/OccurrenceStatus.vue'

const ocorrencias = ref([])
const carregando = ref(true)
const erro = ref(false)
const confirmandoId = ref(null)
const excluindoId = ref(null)

onMounted(() => {
  authService.minhasOcorrencias()
    .then((data) => { ocorrencias.value = data })
    .catch(() => { erro.value = true })
    .finally(() => { carregando.value = false })
})

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function pedirConfirmacao(id) {
  confirmandoId.value = id
}

function cancelarConfirmacao() {
  confirmandoId.value = null
}

function excluir(id) {
  excluindoId.value = id
  authService.excluirMinhaOcorrencia(id)
    .then(() => { ocorrencias.value = ocorrencias.value.filter((o) => o.id !== id) })
    .catch(() => { erro.value = true })
    .finally(() => { confirmandoId.value = null; excluindoId.value = null })
}
</script>

<template>
  <div class="flex flex-col gap-3 p-5 max-w-2xl mx-auto w-full">
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
        <span v-if="item.address?.city" class="text-xs text-gray-500">
          📍 {{ [item.address.neighborhood, item.address.city].filter(Boolean).join(', ') }}
        </span>
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-gray-400">{{ formatarData(item.createdAt) }}</span>

          <div v-if="confirmandoId === item.id" class="flex items-center gap-3">
            <button
              type="button"
              class="text-xs text-gray-500"
              :disabled="excluindoId === item.id"
              @click="cancelarConfirmacao"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="text-xs font-semibold text-red-500 disabled:opacity-50"
              :disabled="excluindoId === item.id"
              @click="excluir(item.id)"
            >
              Confirmar exclusão?
            </button>
          </div>
          <button
            v-else
            type="button"
            class="text-xs text-red-500"
            @click="pedirConfirmacao(item.id)"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

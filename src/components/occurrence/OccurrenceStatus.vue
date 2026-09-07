<script setup>
import { computed } from 'vue'
import { STATUS_CFG } from '@/constants/tokens'

const props = defineProps({
  status: { type: Object, required: true }, // { id, name }
})

const cfg = computed(() => STATUS_CFG[props.status?.name] ?? { c: '#6b7280', bg: '#f3f4f6', icon: '●', label: props.status?.name })
</script>

<template>
  <span
    class="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
    :style="{ color: cfg.c, backgroundColor: cfg.bg }"
    :title="`Status: ${props.status?.name}`"
  >
    <span aria-hidden="true">{{ cfg.icon }}</span>
    {{ cfg.label }}
  </span>
</template>

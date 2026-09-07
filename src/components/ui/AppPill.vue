<script setup>
defineProps({
  color: { type: String, default: '#0d9488' },
  bg: { type: String, default: '#f0fdfa' },
})
</script>

<template>
  <span
    class="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
    :style="{ color, backgroundColor: bg }"
  >
    <slot />
  </span>
</template>

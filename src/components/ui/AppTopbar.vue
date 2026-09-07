<script setup>
defineProps({
  showBack: { type: Boolean, default: false },
  title: { type: String, default: 'Voz da Rua' },
})
defineEmits(['back'])
</script>

<template>
  <header class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 min-h-[52px]">
    <button
      v-if="showBack"
      type="button"
      aria-label="Voltar"
      class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
      @click="$emit('back')"
    >
      <span aria-hidden="true">←</span>
    </button>
    <div class="flex items-center gap-1.5 text-base font-extrabold text-gray-900">
      {{ title }}
    </div>
    <div class="flex-1" />
    <slot name="actions" />
  </header>
</template>

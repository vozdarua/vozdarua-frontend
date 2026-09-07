<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | outline | ghost
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['click'])

const VARIANTS = {
  primary: 'bg-teal text-white hover:bg-teal-dark active:scale-95',
  outline: 'bg-white text-teal-dark border-1.5 border-teal hover:bg-teal-soft active:scale-95',
  ghost: 'bg-transparent text-teal hover:underline',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full min-h-[48px] rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
    :class="VARIANTS[variant]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

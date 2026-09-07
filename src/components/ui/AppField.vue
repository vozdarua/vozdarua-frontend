<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: ' ' }, // espaço intencional para :placeholder-shown funcionar
  error: { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const fieldId = useId()
const errorId = computed(() => `${fieldId}-error`)
const hasValue = computed(() => props.modelValue && props.modelValue.length > 0)
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="relative">
      <input
        :id="fieldId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-describedby="error ? errorId : undefined"
        :aria-invalid="!!error || undefined"
        class="peer w-full rounded-xl border border-gray-200 px-3.5 pt-5 pb-2.5 text-sm text-gray-800 outline-none transition-all duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20 placeholder-transparent"
        :class="error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <label
        v-if="label"
        :for="fieldId"
        class="pointer-events-none absolute left-3.5 top-3.5 text-sm text-gray-400 transition-all duration-150 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-teal peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
        :class="error ? 'peer-focus:text-red-400' : ''"
      >
        {{ label }}
      </label>
    </div>
    <p
      v-if="error"
      :id="errorId"
      role="alert"
      class="text-xs text-red-500 px-1"
    >{{ error }}</p>
  </div>
</template>

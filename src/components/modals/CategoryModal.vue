<script setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  categoria: { type: Object, default: null },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <TransitionRoot appear :show="props.open" as="template">
    <Dialog class="relative z-[4000]" @close="emit('cancel')">
      <Teleport to="body">
        <TransitionChild
          enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0"
          as="div" class="fixed inset-0 bg-black/40 z-[4000]"
        />

        <div class="fixed inset-0 z-[4001] flex items-end sm:items-center justify-center pointer-events-none">
          <TransitionChild
            enter="ease-out duration-200" enter-from="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95" enter-to="translate-y-0 sm:opacity-100 sm:scale-100"
            leave="ease-in duration-150" leave-from="translate-y-0 sm:opacity-100 sm:scale-100" leave-to="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
            as="div" class="pointer-events-auto w-full sm:max-w-sm"
          >
            <DialogPanel class="rounded-t-2xl sm:rounded-2xl bg-white p-6 flex flex-col gap-4 shadow-2xl mx-0 sm:mx-4">
              <template v-if="props.categoria">
                <div class="flex flex-col items-center gap-2 text-center">
                  <span class="text-4xl">{{ props.categoria.e }}</span>
                  <h3 class="text-lg font-bold text-gray-800">{{ props.categoria.l }}</h3>
                  <p class="text-sm text-gray-500">{{ props.categoria.ex }}</p>
                </div>
                <div class="flex flex-col gap-2">
                  <AppButton @click="emit('confirm', props.categoria)">Confirmar</AppButton>
                  <AppButton variant="ghost" @click="emit('cancel')">Cancelar</AppButton>
                </div>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Teleport>
    </Dialog>
  </TransitionRoot>
</template>

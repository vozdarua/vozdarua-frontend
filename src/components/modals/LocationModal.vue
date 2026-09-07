<script setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { useUiStore } from '@/stores/ui'
import { useGeolocation } from '@/composables/useGeolocation'
import AppButton from '@/components/ui/AppButton.vue'

const ui = useUiStore()
const { pedirPermissao } = useGeolocation()

async function permitir() {
  try {
    await pedirPermissao()
  } finally {
    ui.closeLocationModal()
  }
}

function negar() {
  ui.closeLocationModal()
}
</script>

<template>
  <TransitionRoot appear :show="ui.locationModalOpen" as="template">
    <Dialog class="relative z-50" @close="negar">
      <TransitionChild
        enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 flex items-end justify-center">
        <TransitionChild
          enter="ease-out duration-200" enter-from="translate-y-full" enter-to="translate-y-0"
          leave="ease-in duration-150" leave-from="translate-y-0" leave-to="translate-y-full"
        >
          <DialogPanel class="w-full max-w-md rounded-t-2xl bg-white p-6 flex flex-col gap-4">
            <h3 class="text-lg font-bold text-gray-800">Permitir localização?</h3>
            <p class="text-sm text-gray-500">
              Usamos sua localização para mostrar ocorrências próximas e agilizar o registro.
            </p>
            <AppButton @click="permitir">Permitir localização</AppButton>
            <AppButton variant="ghost" @click="negar">Agora não</AppButton>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

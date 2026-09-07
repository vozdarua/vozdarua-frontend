<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem('vozdarua_welcome_seen')) {
    visible.value = true
  }
})

function fechar() {
  localStorage.setItem('vozdarua_welcome_seen', '1')
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[5000] flex items-center justify-center px-5"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Card -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
        >
          <div
            v-if="visible"
            class="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <!-- Topo colorido -->
            <div class="bg-teal-dark px-6 pt-7 pb-5 sm:pt-10 sm:pb-7 flex flex-col items-center text-center gap-2 sm:gap-3">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-4xl">
                📣
              </div>
              <div>
                <h1 class="text-lg sm:text-2xl font-extrabold text-white tracking-tight">Voz da Rua</h1>
                <p class="text-xs sm:text-sm text-white/70 mt-0.5">São José dos Campos</p>
              </div>
            </div>

            <!-- Conteúdo -->
            <div class="px-5 py-5 sm:px-8 sm:py-7 flex flex-col gap-4 sm:gap-6">
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed text-center">
                Uma plataforma <span class="font-semibold text-gray-900">gratuita</span> para dar voz às pessoas sobre como estão as ruas da cidade.
              </p>

              <div class="flex flex-col gap-2.5 sm:gap-4">
                <div class="flex items-start gap-3">
                  <span class="text-base sm:text-xl mt-0.5 flex-shrink-0">📍</span>
                  <div>
                    <p class="text-sm sm:text-base font-semibold text-gray-800">Registre ocorrências</p>
                    <p class="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">Buracos, iluminação, lixo, alagamentos e muito mais — em qualquer rua da cidade.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-base sm:text-xl mt-0.5 flex-shrink-0">🗺️</span>
                  <div>
                    <p class="text-sm sm:text-base font-semibold text-gray-800">Veja no mapa</p>
                    <p class="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">Acompanhe em tempo real o que outros moradores estão reportando no seu bairro.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-base sm:text-xl mt-0.5 flex-shrink-0">✅</span>
                  <div>
                    <p class="text-sm sm:text-base font-semibold text-gray-800">Acompanhe o status</p>
                    <p class="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">Saiba quando um problema foi recebido, está em análise ou já foi resolvido.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="w-full min-h-[48px] sm:min-h-[52px] rounded-xl bg-teal text-white font-bold text-sm sm:text-base hover:bg-teal-dark active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                @click="fechar"
              >
                Começar agora
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

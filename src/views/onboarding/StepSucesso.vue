<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()

function haptic() { if (navigator.vibrate) navigator.vibrate([10, 50, 10]) }

onMounted(() => haptic())

function irParaApp() {
  router.push('/app/mapa')
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 text-center pt-16">
    <!-- Ícone animado -->
    <div class="relative">
      <div class="h-24 w-24 rounded-full bg-teal-soft flex items-center justify-center animate-bounce-in">
        <svg class="w-12 h-12 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div class="absolute inset-0 rounded-full bg-teal/10 animate-ping" style="animation-duration:1.5s" aria-hidden="true" />
    </div>

    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Ocorrência registrada!</h1>
      <p class="text-sm text-gray-500 max-w-xs leading-relaxed">
        Obrigado por fazer sua voz ser ouvida. Sua ocorrência será analisada e você pode acompanhar o status no mapa.
      </p>
    </div>

    <AppButton @click="irParaApp">Ver no mapa</AppButton>
  </div>
</template>

<style scoped>
@keyframes bounce-in {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
</style>

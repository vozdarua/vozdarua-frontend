<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { isStandalone } from '@/utils/pwa'

const DISMISS_KEY = 'vozdarua_install_dismissed_at'
const DISMISS_DAYS = 14

const open = ref(false)
const iosOpen = ref(false)
let deferredPrompt = null
let iosTimer = null

function recentlyDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  return (Date.now() - Number(raw)) / 86400000 < DISMISS_DAYS
}

function isMobile() {
  return /android|iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function handleBeforeInstall(e) {
  e.preventDefault()
  deferredPrompt = e
  open.value = true
}

function dismiss() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()))
  open.value = false
  iosOpen.value = false
}

async function instalar() {
  if (!deferredPrompt) return
  await deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
  open.value = false
  localStorage.setItem(DISMISS_KEY, String(Date.now()))
}

onMounted(() => {
  if (!isMobile() || isStandalone() || recentlyDismissed()) return

  window.addEventListener('beforeinstallprompt', handleBeforeInstall)

  // ponytail: iOS Safari não dispara beforeinstallprompt nem tem API de instalação
  // programática — só resta mostrar a instrução manual após um respiro na visita.
  if (isIos()) {
    iosTimer = window.setTimeout(() => { iosOpen.value = true }, 3000)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  if (iosTimer) window.clearTimeout(iosTimer)
})
</script>

<template>
  <Teleport to="body">
    <!-- Android/Chrome: prompt nativo -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[5000] flex items-center justify-center px-5">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="dismiss" />
        <div class="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-teal-dark px-6 pt-7 pb-5 flex flex-col items-center text-center gap-2">
            <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">📲</div>
            <h1 class="text-lg font-extrabold text-white tracking-tight">Instalar o Voz da Rua</h1>
          </div>
          <div class="px-5 py-5 flex flex-col gap-4">
            <p class="text-sm text-gray-600 leading-relaxed text-center">
              Adicione o app à tela inicial pra abrir mais rápido, como um app de verdade.
            </p>
            <div class="flex gap-2.5">
              <button
                type="button"
                class="flex-1 min-h-[48px] rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors"
                @click="dismiss"
              >Agora não</button>
              <button
                type="button"
                class="flex-1 min-h-[48px] rounded-xl bg-teal text-white font-bold text-sm hover:bg-teal-dark active:scale-95 transition-all"
                @click="instalar"
              >Instalar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- iOS: instrução manual (sem API de instalação) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="iosOpen" class="fixed inset-0 z-[5000] flex items-center justify-center px-5">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="dismiss" />
        <div class="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-teal-dark px-6 pt-7 pb-5 flex flex-col items-center text-center gap-2">
            <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">📲</div>
            <h1 class="text-lg font-extrabold text-white tracking-tight">Instalar o Voz da Rua</h1>
          </div>
          <div class="px-5 py-5 flex flex-col gap-4">
            <p class="text-sm text-gray-600 leading-relaxed text-center">
              Adicione o app à tela inicial pra abrir como um app de verdade:
            </p>
            <ol class="text-sm text-gray-700 leading-loose list-decimal pl-5">
              <li>Toque em <span class="font-semibold">Compartilhar</span> (⬆️) na barra do Safari</li>
              <li>Escolha <span class="font-semibold">"Adicionar à Tela de Início"</span></li>
            </ol>
            <button
              type="button"
              class="w-full min-h-[48px] rounded-xl bg-teal text-white font-bold text-sm hover:bg-teal-dark active:scale-95 transition-all"
              @click="dismiss"
            >Entendi</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { user, isLoggedIn, logout } = useAuth()
const router = useRouter()
const open = ref(false)

function iniciais(email) {
  return email ? email.slice(0, 2).toUpperCase() : '?'
}

function sair() {
  open.value = false
  logout()
  router.push('/app/mapa')
}

function irPerfil() {
  open.value = false
  router.push('/app/perfil')
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-colors ring-2 ring-white/30"
      @click="open = !open"
    >
      {{ iniciais(user?.email) }}
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[3000] overflow-hidden"
      >
        <!-- Info do usuário -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-xs font-bold text-gray-800 truncate">{{ user?.email }}</p>
          <p class="text-[11px] text-gray-400">{{ user?.phone }}</p>
        </div>

        <div class="py-1">
          <button
            type="button"
            class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
            @click="irPerfil"
          >
            <span>👤</span> Meu perfil
          </button>
          <button
            type="button"
            class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 text-left"
            @click="sair"
          >
            <span>↩</span> Sair da conta
          </button>
        </div>
      </div>
    </Transition>

    <!-- Fecha ao clicar fora -->
    <div v-if="open" class="fixed inset-0 z-[2999]" @click="open = false" />
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

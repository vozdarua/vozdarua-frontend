<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthModal from '@/components/auth/AuthModal.vue'
import UserMenu from '@/components/auth/UserMenu.vue'
import WelcomeModal from '@/components/ui/WelcomeModal.vue'

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

const TABS_ESQUERDA = computed(() => isLoggedIn.value
  ? [{ path: '/app/mapa', label: 'Mapa', icon: '🗺️' }, { path: '/app/minhas', label: 'Minhas', icon: '📋' }]
  : [{ path: '/app/mapa', label: 'Mapa', icon: '🗺️' }]
)

const TABS_DIREITA = computed(() => isLoggedIn.value
  ? [{ path: '/app/alertas', label: 'Alertas', icon: '🔔' }, { path: '/app/perfil', label: 'Perfil', icon: '👤' }]
  : [{ path: '/app/ranking', label: 'Ranking', icon: '🏆' }]
)

const TABS_DESKTOP = computed(() => isLoggedIn.value
  ? [{ path: '/app/mapa', label: 'Mapa', icon: '🗺️' }, { path: '/app/minhas', label: 'Minhas', icon: '📋' }, { path: '/app/alertas', label: 'Alertas', icon: '🔔' }, { path: '/app/ranking', label: 'Ranking', icon: '🏆' }]
  : [{ path: '/app/mapa', label: 'Mapa', icon: '🗺️' }, { path: '/app/ranking', label: 'Ranking', icon: '🏆' }]
)

const authModal = ref(false)
const authMode = ref('login')
const menuAberto = ref(false)

function abrirLogin() { authMode.value = 'login'; authModal.value = true }
function abrirCadastro() { authMode.value = 'cadastro'; authModal.value = true }

function navTab(path) {
  if ((path === '/app/perfil' || path === '/app/minhas' || path === '/app/alertas') && !isLoggedIn.value) {
    abrirLogin()
  } else {
    router.push(path)
  }
}

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">

    <!-- Header mobile -->
    <header class="lg:hidden flex items-center gap-3 px-5 py-4 bg-teal-dark text-white sticky top-0 z-[2000] shadow">
      <!-- Menu sanduíche -->
      <div class="relative">
        <button
          type="button"
          aria-label="Menu"
          class="flex flex-col justify-center gap-[5px] w-8 h-8 items-center"
          @click="menuAberto = !menuAberto"
        >
          <span class="block w-5 h-0.5 bg-white rounded-full transition-all duration-200" :class="menuAberto ? 'rotate-45 translate-y-[7px]' : ''" />
          <span class="block w-5 h-0.5 bg-white rounded-full transition-all duration-200" :class="menuAberto ? 'opacity-0' : ''" />
          <span class="block w-5 h-0.5 bg-white rounded-full transition-all duration-200" :class="menuAberto ? '-rotate-45 -translate-y-[7px]' : ''" />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="menuAberto"
          class="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px] z-50"
          @click="menuAberto = false"
        >
          <button
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            @click="router.push('/app/sobre')"
          >
            <span>ℹ️</span> Sobre
          </button>
          <button
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left border-t border-gray-50"
            @click="router.push('/app/feedback')"
          >
            <span>💬</span> Feedback
          </button>
        </div>
      </div>

      <div class="font-extrabold text-base cursor-pointer" @click="router.push('/app/mapa')">
        Voz da Rua
      </div>

      <div class="flex-1" />

      <template v-if="isLoggedIn">
        <UserMenu />
      </template>
      <template v-else>
        <button
          type="button"
          class="text-sm font-bold bg-white text-teal-dark rounded-xl px-4 py-2 shadow hover:bg-teal-soft transition-colors"
          @click="abrirLogin"
        >Entrar</button>
      </template>
    </header>

    <!-- Backdrop menu sanduíche -->
    <div
      v-if="menuAberto"
      class="lg:hidden fixed inset-0 z-[1999]"
      @click="menuAberto = false"
    />

    <!-- Topbar desktop -->
    <header class="hidden lg:flex items-center gap-6 px-6 py-3 bg-teal-dark text-white sticky top-0 z-[2000] shadow">
      <div class="text-lg font-extrabold mr-4 cursor-pointer" @click="router.push('/app/mapa')">
        Voz da Rua
      </div>

      <nav class="flex items-center gap-1 flex-1">
        <button
          v-for="tab in TABS_DESKTOP"
          :key="tab.path"
          type="button"
          class="flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors"
          :class="isActive(tab.path) ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'"
          @click="router.push(tab.path)"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <div class="flex items-center gap-1 ml-auto">
        <button
          type="button"
          class="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
          :class="isActive('/app/sobre') ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'"
          @click="router.push('/app/sobre')"
        >Sobre</button>
        <button
          type="button"
          class="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
          :class="isActive('/app/feedback') ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'"
          @click="router.push('/app/feedback')"
        >Feedback</button>
        <div class="w-px h-5 bg-white/20 mx-1" />
        <template v-if="isLoggedIn">
          <UserMenu />
        </template>
        <template v-else>
          <button type="button" class="text-sm font-semibold text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors" @click="abrirLogin">Entrar</button>
          <button type="button" class="text-sm font-semibold bg-white text-teal-dark px-4 py-1.5 rounded-lg hover:bg-teal-mid transition-colors" @click="abrirCadastro">Criar conta</button>
        </template>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 flex flex-col overflow-y-auto pb-16 lg:pb-0">
      <router-view />
    </main>

    <!-- Bottom nav mobile -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 flex items-end border-t border-gray-100 bg-white z-[2000]" role="navigation" aria-label="Navegação principal">
      <!-- Tabs esquerda -->
      <button
        v-for="tab in TABS_ESQUERDA"
        :key="tab.path"
        type="button"
        :aria-label="tab.label"
        :aria-current="isActive(tab.path) ? 'page' : undefined"
        class="flex-1 flex flex-col items-center justify-center py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
        :class="isActive(tab.path) ? 'text-teal' : 'text-gray-400'"
        @click="navTab(tab.path)"
      >
        <span
          class="flex items-center justify-center rounded-2xl transition-all duration-200 text-2xl"
          :class="isActive(tab.path) ? 'bg-teal-soft px-4 py-1' : 'px-4 py-1'"
          aria-hidden="true"
        >{{ tab.icon }}</span>
      </button>

      <!-- Botão central FAB -->
      <div class="flex flex-col items-center px-2 -mt-5 pb-3">
        <button
          type="button"
          aria-label="Registrar nova ocorrência"
          class="flex items-center justify-center w-14 h-14 rounded-full bg-teal text-white text-2xl shadow-lg shadow-teal/40 border-4 border-white hover:bg-teal-dark active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          @click="router.push('/app/registrar')"
        >
          <span aria-hidden="true" class="font-light leading-none">＋</span>
        </button>
      </div>

      <!-- Tabs direita -->
      <button
        v-for="tab in TABS_DIREITA"
        :key="tab.path"
        type="button"
        :aria-label="tab.label"
        :aria-current="isActive(tab.path) ? 'page' : undefined"
        class="flex-1 flex flex-col items-center justify-center py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
        :class="isActive(tab.path) ? 'text-teal' : 'text-gray-400'"
        @click="navTab(tab.path)"
      >
        <span
          class="flex items-center justify-center rounded-2xl transition-all duration-200 text-2xl"
          :class="isActive(tab.path) ? 'bg-teal-soft px-4 py-1' : 'px-4 py-1'"
          aria-hidden="true"
        >{{ tab.icon }}</span>
      </button>
    </nav>

    <AuthModal :open="authModal" :initial-mode="authMode" @close="authModal = false" />
    <WelcomeModal />
  </div>
</template>

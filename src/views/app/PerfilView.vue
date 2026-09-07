<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useCidadeStore } from '@/stores/cidade'
import * as authService from '@/services/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppField from '@/components/ui/AppField.vue'

const router = useRouter()
const { user, isLoggedIn, logout } = useAuth()
const authStore = useAuthStore()
const cidadeStore = useCidadeStore()

const aba = ref('perfil') // perfil | senha
const novaSenha = ref('')
const mensagem = ref('')
const mensagemTipo = ref('ok') // ok | erro
const stats = ref({ inCity: 0, resolved: 0, open: 0 })

onMounted(() => {
  if (!isLoggedIn.value) router.push('/app/mapa')
  authService.estatisticasUsuario(cidadeStore.cidadeAtual.nome)
    .then((s) => { stats.value = s })
    .catch(() => {})
})

function iniciais(email) {
  return email ? email.slice(0, 2).toUpperCase() : '?'
}

async function alterarSenha() {
  mensagem.value = ''
  if (!user.value?.id || !novaSenha.value) return
  try {
    await authService.atualizarUsuario(user.value.id, {
      email: user.value.email,
      phone: user.value.phone,
      password: novaSenha.value,
    })
    mensagem.value = 'Senha alterada com sucesso.'
    mensagemTipo.value = 'ok'
    novaSenha.value = ''
  } catch {
    mensagem.value = 'Não foi possível alterar a senha.'
    mensagemTipo.value = 'erro'
  }
}

function sair() {
  logout()
  router.push('/app/mapa')
}
</script>

<template>
  <div class="flex flex-col min-h-full">
    <!-- Header de perfil -->
    <div class="bg-teal-dark text-white px-6 pt-10 pb-20">
      <div class="flex items-center gap-5">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white ring-4 ring-white/20">
          {{ iniciais(user?.email) }}
        </div>
        <div>
          <p class="text-base font-bold">{{ user?.email }}</p>
          <p class="text-sm text-teal-mid">{{ user?.phone }}</p>
          <span class="mt-1 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-teal-mid">
            Membro ativo
          </span>
        </div>
      </div>
    </div>

    <!-- Stats rápidos -->
    <div class="mx-5 -mt-10 grid grid-cols-3 gap-3 z-10 relative">
      <div class="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center">
        <p class="text-2xl font-extrabold text-gray-800">{{ stats.inCity }}</p>
        <p class="text-xs text-gray-400 mt-1">Na cidade</p>
      </div>
      <div class="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center">
        <p class="text-2xl font-extrabold text-emerald-500">{{ stats.resolved }}</p>
        <p class="text-xs text-gray-400 mt-1">Resolvidas</p>
      </div>
      <div class="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 text-center">
        <p class="text-2xl font-extrabold text-amber-500">{{ stats.open }}</p>
        <p class="text-xs text-gray-400 mt-1">Em aberto</p>
      </div>
    </div>

    <!-- Abas -->
    <div class="flex border-b border-gray-100 mt-8 mx-5">
      <button
        type="button"
        class="flex-1 py-3 text-sm font-semibold border-b-2 transition-colors"
        :class="aba === 'perfil' ? 'border-teal text-teal' : 'border-transparent text-gray-400'"
        @click="aba = 'perfil'"
      >Meus dados</button>
      <button
        type="button"
        class="flex-1 py-3 text-sm font-semibold border-b-2 transition-colors"
        :class="aba === 'senha' ? 'border-teal text-teal' : 'border-transparent text-gray-400'"
        @click="aba = 'senha'"
      >Segurança</button>
    </div>

    <!-- Conteúdo das abas -->
    <div class="flex-1 px-5 py-6">

      <!-- Aba: perfil -->
      <div v-if="aba === 'perfil'" class="flex flex-col gap-5">
        <div class="rounded-2xl bg-gray-50 border border-gray-100 divide-y divide-gray-100">
          <div class="flex items-center justify-between px-4 py-4">
            <span class="text-sm text-gray-400">E-mail</span>
            <span class="text-base font-medium text-gray-700">{{ user?.email }}</span>
          </div>
          <div class="flex items-center justify-between px-4 py-4">
            <span class="text-sm text-gray-400">Telefone</span>
            <span class="text-base font-medium text-gray-700">{{ user?.phone || '—' }}</span>
          </div>
        </div>

        <div class="rounded-2xl bg-gray-50 border border-gray-100 divide-y divide-gray-100">
          <button
            type="button"
            class="flex items-center justify-between w-full px-4 py-4 text-base text-gray-700 hover:bg-gray-100 rounded-2xl"
            @click="router.push('/app/mapa')"
          >
            <span>Ver mapa da cidade</span>
            <span class="text-gray-400">→</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-between w-full px-4 py-4 text-base text-gray-700 hover:bg-gray-100"
            @click="router.push('/app/registrar')"
          >
            <span>Registrar nova ocorrência</span>
            <span class="text-gray-400">→</span>
          </button>
        </div>

        <AppButton variant="ghost" class="text-red-500 mt-2" @click="sair">
          Sair da conta
        </AppButton>
      </div>

      <!-- Aba: senha -->
      <div v-else-if="aba === 'senha'" class="flex flex-col gap-4">
        <p class="text-xs text-gray-500">
          Sua senha atual é usada junto com o e-mail para autenticar todas as ações na plataforma.
        </p>
        <AppField v-model="novaSenha" type="password" label="Nova senha" placeholder="Mínimo 6 caracteres" />
        <p
          v-if="mensagem"
          class="text-xs px-3 py-2 rounded-lg"
          :class="mensagemTipo === 'ok' ? 'text-teal-dark bg-teal-soft' : 'text-red-600 bg-red-50'"
        >{{ mensagem }}</p>
        <AppButton :disabled="novaSenha.length < 6" @click="alterarSenha">
          Salvar nova senha
        </AppButton>
      </div>

    </div>
  </div>
</template>

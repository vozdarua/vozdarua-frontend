<script setup>
import { ref, watch, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import AppButton from '@/components/ui/AppButton.vue'
import AppField from '@/components/ui/AppField.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  initialMode: { type: String, default: 'login' }, // login | cadastro | esqueci
})
const emit = defineEmits(['close', 'success'])

const { login, registrar, solicitarRecuperacaoSenha } = useAuth()
const modo = ref(props.initialMode)
const erro = ref('')
const sucesso = ref('')
const enviando = ref(false)

watch(() => props.initialMode, (v) => { modo.value = v })
watch(() => props.open, (v) => { if (v) { erro.value = ''; sucesso.value = '' } })

const schemaCadastro = toTypedSchema(z.object({
  phone: z.string().min(8, 'Informe um telefone válido'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
}))

const schemaLogin = toTypedSchema(z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
}))

const schemaEsqueci = toTypedSchema(z.object({
  email: z.string().email('E-mail inválido'),
}))

function schemaDoModo() {
  if (modo.value === 'cadastro') return schemaCadastro
  if (modo.value === 'esqueci') return schemaEsqueci
  return schemaLogin
}

const { handleSubmit, errors, defineField, resetForm } = useForm({
  // ponytail: computed em vez de valor fixo — modo muda depois do form já montado
  // (prop initialMode, ou trocarModo()), e useForm só reage a mudança de schema
  // se ela for reativa.
  validationSchema: computed(schemaDoModo),
})

const [phone] = defineField('phone')
const [email] = defineField('email')
const [password] = defineField('password')

function trocarModo(m) {
  modo.value = m
  erro.value = ''
  sucesso.value = ''
  resetForm()
}

const onSubmit = handleSubmit(async (values) => {
  enviando.value = true
  erro.value = ''
  try {
    if (modo.value === 'cadastro') {
      await registrar({ email: values.email, password: values.password, phone: values.phone })
      emit('success')
      emit('close')
    } else if (modo.value === 'esqueci') {
      await solicitarRecuperacaoSenha(values.email)
      // ponytail: mensagem sempre genérica — o backend já responde igual exista ou
      // não o e-mail, e a tela não deve diferenciar tampouco (evita enumeração).
      sucesso.value = 'Se o e-mail existir em nossa base, enviamos um link de redefinição de senha.'
    } else {
      await login({ email: values.email, password: values.password })
      emit('success')
      emit('close')
    }
  } catch (e) {
    erro.value = e.response?.data?.error || 'Verifique seus dados e tente novamente.'
  } finally {
    enviando.value = false
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <!-- Card -->
        <div class="relative z-10 w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 flex flex-col gap-5 mx-0 sm:mx-4">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-gray-800">
                {{ modo === 'login' ? 'Entrar na conta' : modo === 'cadastro' ? 'Criar conta' : 'Recuperar senha' }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5">Voz da Rua</p>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 text-lg"
              @click="emit('close')"
            >×</button>
          </div>

          <!-- Sucesso (modo esqueci) -->
          <div v-if="modo === 'esqueci' && sucesso" class="flex flex-col gap-4">
            <p class="text-xs text-teal-dark bg-teal-soft rounded-lg px-3 py-2.5 leading-relaxed">{{ sucesso }}</p>
            <button
              type="button"
              class="text-xs font-semibold text-teal underline self-center"
              @click="trocarModo('login')"
            >Voltar para login</button>
          </div>

          <!-- Form -->
          <form v-else class="flex flex-col gap-3" @submit="onSubmit">
            <AppField
              v-if="modo === 'cadastro'"
              v-model="phone"
              label="Telefone"
              type="tel"
              mask="phone"
              placeholder="(11) 99999-9999"
              :error="errors.phone"
            />
            <AppField
              v-model="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              :error="errors.email"
            />
            <AppField
              v-if="modo !== 'esqueci'"
              v-model="password"
              label="Senha"
              type="password"
              placeholder="••••••"
              :error="errors.password"
            />

            <button
              v-if="modo === 'login'"
              type="button"
              class="text-xs font-semibold text-teal underline self-end -mt-1"
              @click="trocarModo('esqueci')"
            >Esqueci minha senha</button>

            <p v-if="erro" class="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ erro }}</p>

            <AppButton type="submit" :disabled="enviando" class="mt-1">
              {{ enviando ? 'Aguarde...' : (modo === 'login' ? 'Entrar' : modo === 'cadastro' ? 'Criar conta' : 'Enviar link de redefinição') }}
            </AppButton>
          </form>

          <!-- Toggle modo -->
          <div v-if="modo !== 'esqueci'" class="flex items-center justify-center gap-1 text-xs text-gray-500">
            <span>{{ modo === 'login' ? 'Não tem conta?' : 'Já tem conta?' }}</span>
            <button
              type="button"
              class="font-semibold text-teal underline"
              @click="trocarModo(modo === 'login' ? 'cadastro' : 'login')"
            >
              {{ modo === 'login' ? 'Criar agora' : 'Entrar' }}
            </button>
          </div>
          <div v-else-if="!sucesso" class="flex items-center justify-center gap-1 text-xs text-gray-500">
            <button type="button" class="font-semibold text-teal underline" @click="trocarModo('login')">
              Voltar para login
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

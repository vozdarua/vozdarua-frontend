<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import AppButton from '@/components/ui/AppButton.vue'
import AppField from '@/components/ui/AppField.vue'

const route = useRoute()
const router = useRouter()
const { redefinirSenha } = useAuth()

const token = computed(() => route.query.token || '')
const erro = ref('')
const enviando = ref(false)

const schema = toTypedSchema(
  z.object({
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a nova senha'),
  }).refine((v) => v.password === v.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })
)

const { handleSubmit, errors, defineField } = useForm({ validationSchema: schema })
const [password] = defineField('password')
const [confirmarSenha] = defineField('confirmarSenha')

const onSubmit = handleSubmit(async (values) => {
  if (!token.value) return
  enviando.value = true
  erro.value = ''
  try {
    await redefinirSenha(token.value, values.password)
    router.push('/app/mapa')
  } catch (e) {
    erro.value = e.response?.data?.error || 'Link inválido ou expirado. Peça um novo link de redefinição.'
  } finally {
    enviando.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-5">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
      <div>
        <h1 class="text-lg font-bold text-gray-800">Redefinir senha</h1>
        <p class="text-xs text-gray-400 mt-0.5">Voz da Rua</p>
      </div>

      <p v-if="!token" class="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2.5 leading-relaxed">
        Link inválido: nenhum token informado. Solicite um novo link de redefinição de senha.
      </p>

      <form v-else class="flex flex-col gap-3" @submit="onSubmit">
        <AppField v-model="password" label="Nova senha" type="password" placeholder="••••••" :error="errors.password" />
        <AppField v-model="confirmarSenha" label="Confirmar nova senha" type="password" placeholder="••••••" :error="errors.confirmarSenha" />

        <p v-if="erro" class="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ erro }}</p>

        <AppButton type="submit" :disabled="enviando" class="mt-1">
          {{ enviando ? 'Aguarde…' : 'Redefinir senha' }}
        </AppButton>
      </form>

      <button type="button" class="text-xs font-semibold text-teal underline self-center" @click="router.push('/app/mapa')">
        Voltar para o início
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({ tipo: 'sugestao', mensagem: '', nome: '', email: '' })
const enviado = ref(false)
const enviando = ref(false)
const erro = ref('')

async function enviar() {
  if (!form.mensagem.trim()) { erro.value = 'Escreva sua mensagem antes de enviar.'; return }
  erro.value = ''
  enviando.value = true
  await new Promise(r => setTimeout(r, 900))
  enviando.value = false
  enviado.value = true
}

function novoFeedback() {
  form.tipo = 'sugestao'; form.mensagem = ''; form.nome = ''; form.email = ''
  enviado.value = false
}
</script>

<template>
  <div class="max-w-xl mx-auto px-5 py-8 pb-24 lg:pb-8">

    <div class="mb-7">
      <div class="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center text-3xl mb-4">💬</div>
      <h1 class="text-2xl font-extrabold text-gray-900 mb-2">Deixe seu feedback</h1>
      <p class="text-sm text-gray-500 leading-relaxed">
        O Voz da Rua é uma iniciativa em construção. Sua opinião ajuda a melhorar a plataforma para toda a comunidade.
      </p>
    </div>

    <!-- Sucesso -->
    <div v-if="enviado" class="flex flex-col items-center text-center py-12 gap-4">
      <div class="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center text-4xl">✅</div>
      <h2 class="text-lg font-bold text-gray-900">Obrigado pelo feedback!</h2>
      <p class="text-sm text-gray-500 max-w-xs leading-relaxed">
        Sua mensagem foi recebida pelo grupo Tapioca. Vamos ler com atenção e usar para melhorar a plataforma.
      </p>
      <button
        type="button"
        class="mt-2 text-sm font-semibold text-teal border border-teal/40 rounded-2xl px-5 py-2.5 hover:bg-teal/5 transition-colors"
        @click="novoFeedback"
      >Enviar outro feedback</button>
    </div>

    <!-- Formulário -->
    <form v-else @submit.prevent="enviar" class="flex flex-col gap-5">

      <!-- Tipo -->
      <div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo</p>
        <div class="flex gap-2">
          <button
            v-for="opt in [{ value: 'sugestao', label: '💡 Sugestão' }, { value: 'critica', label: '🔧 Crítica' }, { value: 'elogio', label: '👏 Elogio' }]"
            :key="opt.value"
            type="button"
            class="flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-colors"
            :class="form.tipo === opt.value
              ? 'bg-teal text-white border-teal'
              : 'bg-white text-gray-600 border-gray-200 hover:border-teal/40 hover:text-teal'"
            @click="form.tipo = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>

      <!-- Mensagem -->
      <div>
        <label for="mensagem" class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Mensagem <span class="text-red-400">*</span>
        </label>
        <textarea
          id="mensagem"
          v-model="form.mensagem"
          rows="5"
          placeholder="Conte o que você achou, o que falta, o que poderia ser diferente..."
          class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
        />
        <p v-if="erro" class="text-xs text-red-500 mt-1">{{ erro }}</p>
      </div>

      <!-- Nome (opcional) -->
      <div>
        <label for="nome" class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Seu nome <span class="text-gray-400 font-normal normal-case">(opcional)</span>
        </label>
        <input
          id="nome"
          v-model="form.nome"
          type="text"
          placeholder="Como podemos te chamar?"
          class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
        />
      </div>

      <!-- E-mail (opcional) -->
      <div>
        <label for="email" class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          E-mail <span class="text-gray-400 font-normal normal-case">(opcional — para respondermos)</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="seu@email.com"
          class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
        />
      </div>

      <button
        type="submit"
        :disabled="enviando"
        class="w-full py-4 rounded-2xl bg-teal text-white font-bold text-sm shadow-lg shadow-teal/30 hover:bg-teal-dark active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="enviando" class="animate-pulse">Enviando…</span>
        <span v-else>Enviar feedback</span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import * as ocorrenciasService from '@/services/ocorrencias'
import * as comentariosService from '@/services/comentarios'
import { maskEmail } from '@/utils/email'
import OccurrenceStatus from '@/components/occurrence/OccurrenceStatus.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  ocorrencia: { type: Object, default: null },
  lista:      { type: Array,  default: () => [] },
})

const emit = defineEmits(['navegar'])

const ui = useUiStore()
const auth = useAuthStore()

// ── Navegação entre pins ───────────────────────────────────────────────────
const currentIndex = computed(() =>
  props.lista.findIndex(o => o.id === props.ocorrencia?.id)
)
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.lista.length - 1)

function anteriorPin() {
  if (hasPrev.value) emit('navegar', props.lista[currentIndex.value - 1])
}
function proximoPin() {
  if (hasNext.value) emit('navegar', props.lista[currentIndex.value + 1])
}

// ── Fotos ──────────────────────────────────────────────────────────────────
const fotos = computed(() => {
  if (!props.ocorrencia) return []
  if (Array.isArray(props.ocorrencia.photos) && props.ocorrencia.photos.length)
    return props.ocorrencia.photos.map(p => p.s3Url ?? p.url ?? p)
  const p = props.ocorrencia.photo
  if (p?.s3Url) return [p.s3Url]
  if (p?.url)   return [p.url]
  return []
})

const fotoAtual = ref(0)
watch(() => props.ocorrencia?.id, () => { fotoAtual.value = 0 })

function fotoAnterior() { fotoAtual.value = (fotoAtual.value - 1 + fotos.value.length) % fotos.value.length }
function proximaFoto()  { fotoAtual.value = (fotoAtual.value + 1) % fotos.value.length }

// ── Lightbox ───────────────────────────────────────────────────────────────
const lightbox = ref(false)
function abrirLightbox() { if (fotos.value.length) lightbox.value = true }
function fecharLightbox() { lightbox.value = false }

// ── Metadados ──────────────────────────────────────────────────────────────
const enderecoResumo = computed(() => {
  const a = props.ocorrencia?.address
  if (!a) return ''
  return [a.street, a.neighborhood, a.city].filter(Boolean).join(', ')
})

const dataResumo = computed(() => {
  if (!props.ocorrencia?.createdAt) return ''
  return new Date(props.ocorrencia.createdAt).toLocaleDateString('pt-BR')
})

// ── Ações com contadores locais ────────────────────────────────────────────
const confirmacoes = ref(0)
const resolucoes   = ref(0)
const jaConfirmou  = ref(false)
const jaResolveu   = ref(false)

watch(() => props.ocorrencia?.id, () => {
  confirmacoes.value = props.ocorrencia?.confirmIssue ?? 0
  resolucoes.value   = props.ocorrencia?.confirmResolve ?? 0
  jaConfirmou.value  = false
  jaResolveu.value   = false
}, { immediate: true })

async function confirmarProblema() {
  if (!props.ocorrencia) return
  if (jaConfirmou.value) {
    jaConfirmou.value = false
    confirmacoes.value--
  } else {
    jaConfirmou.value = true
    confirmacoes.value++
    if (navigator.vibrate) navigator.vibrate(10)
  }
  try { await ocorrenciasService.confirmarOcorrencia(props.ocorrencia.id) } catch { /* silencia */ }
}

async function marcarResolvido() {
  if (!props.ocorrencia) return
  if (jaResolveu.value) {
    jaResolveu.value = false
    resolucoes.value--
  } else {
    jaResolveu.value = true
    resolucoes.value++
    if (navigator.vibrate) navigator.vibrate(10)
  }
  try { await ocorrenciasService.marcarResolvida(props.ocorrencia.id) } catch { /* silencia */ }
}

// ── Comentários ────────────────────────────────────────────────────────────
const comentarios = ref([])
const novoComentario = ref('')
const enviandoComentario = ref(false)
const erroComentario = ref('')
const carregandoComentarios = ref(false)
const comentariosAbertos = ref(false)
const erroCarregarComentarios = ref('')

watch(() => props.ocorrencia?.id, async (id) => {
  comentarios.value = []
  erroComentario.value = ''
  erroCarregarComentarios.value = ''
  comentariosAbertos.value = false
  if (!id) return
  carregandoComentarios.value = true
  try {
    comentarios.value = await comentariosService.listarComentarios(id)
  } catch {
    erroCarregarComentarios.value = 'Não foi possível carregar os comentários.'
  } finally {
    carregandoComentarios.value = false
  }
}, { immediate: true })

function toggleComentarios() {
  comentariosAbertos.value = !comentariosAbertos.value
}

async function enviarComentario() {
  const texto = novoComentario.value.trim()
  if (!texto || enviandoComentario.value) return
  enviandoComentario.value = true
  erroComentario.value = ''
  try {
    const novo = await comentariosService.adicionarComentario(props.ocorrencia.id, texto)
    comentarios.value.push(novo)
    novoComentario.value = ''
  } catch {
    erroComentario.value = 'Não foi possível enviar o comentário.'
  } finally {
    enviandoComentario.value = false
  }
}

async function excluirComentario(comentarioId) {
  try {
    await comentariosService.deletarComentario(props.ocorrencia.id, comentarioId)
    comentarios.value = comentarios.value.filter(c => c.id !== comentarioId)
  } catch {
    erroComentario.value = 'Não foi possível excluir o comentário.'
  }
}

function formatarData(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function iniciais(email) {
  if (!email) return '?'
  return email.slice(0, 2).toUpperCase()
}
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-200 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-150 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="ui.drawerOpen && ocorrencia"
      role="dialog"
      :aria-label="`Detalhes da ocorrência: ${ocorrencia.description}`"
      aria-modal="true"
      class="fixed right-0 top-16 lg:top-[52px] h-[calc(100%_-_4rem)] lg:h-[calc(100%_-_52px)] z-[2500] flex flex-col bg-white shadow-2xl overflow-hidden"
      :class="ui.drawerFullscreen ? 'w-full' : 'w-[92%] max-w-sm'"
    >
      <!-- Header fixo: fechar + categoria + status + navegação entre pins -->
      <div class="flex-shrink-0 border-b border-gray-100 px-4 pt-4 pb-4 flex flex-col gap-3">

        <!-- Linha 1: Fechar à esquerda, status à direita -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            aria-label="Fechar e voltar ao mapa"
            class="flex items-center gap-1.5 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-gray-700 font-semibold text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            @click="ui.closeDrawer"
          >
            <span aria-hidden="true" class="text-sm font-bold">✕</span>
            Fechar
          </button>
          <OccurrenceStatus :status="ocorrencia.status" />
        </div>

        <!-- Linha 2: Categoria + navegação inline -->
        <div class="flex items-center gap-2">
          <span class="text-xl flex-shrink-0" aria-hidden="true">{{ ocorrencia.category?.icon ?? '📋' }}</span>
          <span class="text-base font-bold text-gray-800 flex-1 truncate">{{ ocorrencia.category?.name ?? 'Ocorrência' }}</span>

          <template v-if="lista.length > 1">
            <button
              type="button"
              aria-label="Ocorrência anterior"
              :disabled="!hasPrev"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              @click="anteriorPin"
            >
              <span aria-hidden="true" class="text-base leading-none">‹</span>
            </button>
            <span class="text-xs text-gray-400 tabular-nums flex-shrink-0">{{ currentIndex + 1 }} de {{ lista.length }}</span>
            <button
              type="button"
              aria-label="Próxima ocorrência"
              :disabled="!hasNext"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              @click="proximoPin"
            >
              <span aria-hidden="true" class="text-base leading-none">›</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Scroll area -->
      <div class="flex-1 overflow-y-auto">

        <!-- Carrousel de fotos -->
        <div v-if="fotos.length > 0" class="relative w-full h-52 bg-gray-100 flex-shrink-0 select-none">
          <img
            :src="fotos[fotoAtual]"
            :alt="`Foto ${fotoAtual + 1} da ocorrência`"
            class="w-full h-full object-cover cursor-zoom-in"
            @click="abrirLightbox"
          />

          <!-- Navegação (só com múltiplas fotos) -->
          <template v-if="fotos.length > 1">
            <button type="button" aria-label="Foto anterior"
              class="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              @click.stop="fotoAnterior">‹</button>
            <button type="button" aria-label="Próxima foto"
              class="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              @click.stop="proximaFoto">›</button>

            <!-- Indicadores -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              <button
                v-for="(_, i) in fotos" :key="i"
                type="button"
                :aria-label="`Ver foto ${i + 1}`"
                class="h-1.5 rounded-full transition-all"
                :class="i === fotoAtual ? 'w-4 bg-white' : 'w-1.5 bg-white/50'"
                @click.stop="fotoAtual = i"
              />
            </div>
          </template>

          <!-- Badge expandir -->
          <button type="button" aria-label="Abrir foto em tamanho maior"
            class="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-white text-[10px] hover:bg-black/60 transition-colors"
            @click="abrirLightbox">
            <span aria-hidden="true">⤢</span> Ampliar
          </button>
        </div>

        <!-- Placeholder sem foto -->
        <div v-else class="w-full h-32 bg-gray-50 flex items-center justify-center text-4xl border-b border-gray-100" aria-hidden="true">
          {{ ocorrencia.category?.icon ?? '📋' }}
        </div>

        <!-- Conteúdo -->
        <div class="flex flex-col gap-3 p-5">

          <!-- Descrição — card igual aos de metadados -->
          <div class="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Descrição</span>
            <p class="text-sm text-gray-700 leading-relaxed">{{ ocorrencia.description || '—' }}</p>
          </div>

          <!-- Metadados em grid -->
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Localização</span>
              <span class="text-sm text-gray-700 leading-snug line-clamp-2">{{ enderecoResumo || '—' }}</span>
            </div>
            <div class="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Registrado em</span>
              <span class="text-sm text-gray-700">{{ dataResumo || '—' }}</span>
            </div>
            <div class="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Severidade</span>
              <span class="text-sm font-semibold" :class="{
                'text-red-500': ocorrencia.severity?.name === 'Alto',
                'text-amber-500': ocorrencia.severity?.name === 'Médio',
                'text-emerald-600': ocorrencia.severity?.name === 'Baixo',
                'text-gray-500': !ocorrencia.severity?.name,
              }">{{ ocorrencia.severity?.name || '—' }}</span>
            </div>
            <div class="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bairro</span>
              <span class="text-sm text-gray-700 font-semibold">{{ ocorrencia.address?.neighborhood || '—' }}</span>
            </div>
          </div>

          <!-- Barra de ações: 3 botões lado a lado -->
          <div class="flex gap-3 pt-1">
            <!-- Confirmar problema -->
            <button
              type="button"
              :class="jaConfirmou
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'"
              class="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              @click="confirmarProblema"
            >
              <span class="text-xl" aria-hidden="true">👍</span>
              <span class="text-xs font-bold leading-tight text-center">Confirmar<br>problema</span>
              <span class="text-xs font-extrabold tabular-nums transition-all">{{ confirmacoes }}</span>
            </button>

            <!-- Já foi resolvido -->
            <button
              type="button"
              :class="jaResolveu
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'"
              class="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              @click="marcarResolvido"
            >
              <span class="text-xl" aria-hidden="true">✅</span>
              <span class="text-xs font-bold leading-tight text-center">Já foi<br>resolvido</span>
              <span class="text-xs font-extrabold tabular-nums transition-all">{{ resolucoes }}</span>
            </button>

            <!-- Comentários (toggle) -->
            <button
              type="button"
              :class="comentariosAbertos
                ? 'bg-teal-soft border-teal text-teal'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'"
              class="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              @click="toggleComentarios"
            >
              <span class="text-xl" aria-hidden="true">💬</span>
              <span class="text-xs font-bold leading-tight text-center">Comentários</span>
              <span class="text-xs font-extrabold tabular-nums">{{ comentarios.length }}</span>
            </button>
          </div>
        </div>

        <!-- Seção de comentários (expansível) -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="comentariosAbertos" class="flex flex-col gap-4 px-5 pb-5">

            <div class="h-px bg-gray-100" />

            <!-- Skeleton -->
            <div v-if="carregandoComentarios" class="flex flex-col gap-3">
              <div v-for="i in 2" :key="i" class="flex gap-2.5">
                <div class="h-8 w-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                <div class="flex-1 flex flex-col gap-1.5">
                  <div class="h-2.5 bg-gray-100 rounded animate-pulse w-24" />
                  <div class="h-2 bg-gray-100 rounded animate-pulse" />
                  <div class="h-2 bg-gray-100 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </div>

            <!-- Lista -->
            <div v-else-if="comentarios.length > 0" class="flex flex-col gap-4">
              <div v-for="c in comentarios" :key="c.id" class="flex gap-2.5">
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-teal-soft flex items-center justify-center text-xs font-bold text-teal">
                  {{ iniciais(c.authorEmail) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline gap-2 flex-wrap">
                    <span class="text-xs font-semibold text-gray-700 truncate">{{ c.authorEmail ? maskEmail(c.authorEmail) : 'Anônimo' }}</span>
                    <span class="text-[10px] text-gray-400 flex-shrink-0">{{ formatarData(c.createdAt) }}</span>
                    <button
                      v-if="auth.isAdmin"
                      type="button"
                      class="ml-auto text-[10px] text-red-400 hover:text-red-600 flex-shrink-0"
                      @click="excluirComentario(c.id)"
                    >
                      Excluir
                    </button>
                  </div>
                  <p class="text-xs text-gray-600 leading-snug mt-0.5">{{ c.text }}</p>
                </div>
              </div>
            </div>

            <p v-else-if="erroCarregarComentarios" class="text-xs text-red-500 text-center py-1">
              {{ erroCarregarComentarios }}
            </p>
            <p v-else-if="!carregandoComentarios" class="text-xs text-gray-400 text-center py-1">
              Nenhum comentário ainda. Seja o primeiro!
            </p>

            <!-- Input (qualquer pessoa, logada ou não) -->
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-end">
                <textarea
                  v-model="novoComentario"
                  placeholder="Adicionar comentário…"
                  rows="2"
                  class="flex-1 resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-teal focus:ring-2 focus:ring-teal-soft transition-colors"
                  @keydown.enter.exact.prevent="enviarComentario"
                />
                <button
                  type="button"
                  aria-label="Enviar comentário"
                  :disabled="!novoComentario.trim() || enviandoComentario"
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal text-white hover:bg-teal-dark active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="enviarComentario"
                >
                  <span aria-hidden="true" class="text-base">↑</span>
                </button>
              </div>
              <p v-if="erroComentario" class="text-xs text-red-500">{{ erroComentario }}</p>
              <p class="text-[10px] text-gray-400">Enter para enviar{{ auth.isLoggedIn ? '' : ' · comentando como Anônimo' }}</p>
            </div>
          </div>
        </Transition>

      </div>
    </aside>
  </Transition>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightbox && fotos.length"
        class="fixed inset-0 z-[9000] bg-black/95 flex flex-col"
        @click.self="fecharLightbox"
      >
        <!-- Barra superior -->
        <div class="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <span class="text-white/60 text-sm">{{ fotoAtual + 1 }} / {{ fotos.length }}</span>
          <button type="button" aria-label="Fechar"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xl"
            @click="fecharLightbox">✕</button>
        </div>

        <!-- Imagem -->
        <div class="flex-1 flex items-center justify-center px-4 min-h-0 relative">
          <img
            :src="fotos[fotoAtual]"
            :alt="`Foto ${fotoAtual + 1}`"
            class="max-w-full max-h-full object-contain rounded-lg"
          />

          <template v-if="fotos.length > 1">
            <button type="button" aria-label="Foto anterior"
              class="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-colors"
              @click.stop="fotoAnterior">‹</button>
            <button type="button" aria-label="Próxima foto"
              class="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-colors"
              @click.stop="proximaFoto">›</button>
          </template>
        </div>

        <!-- Miniaturas -->
        <div v-if="fotos.length > 1" class="flex-shrink-0 flex justify-center gap-2 py-4 px-4 overflow-x-auto">
          <button
            v-for="(url, i) in fotos" :key="i"
            type="button"
            :aria-label="`Ver foto ${i + 1}`"
            class="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden transition-all"
            :class="i === fotoAtual ? 'ring-2 ring-white scale-105' : 'opacity-50 hover:opacity-80'"
            @click.stop="fotoAtual = i"
          >
            <img :src="url" :alt="`Miniatura ${i + 1}`" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

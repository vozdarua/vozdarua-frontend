<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import L from 'leaflet'
import axios from 'axios'
import { useGeolocationStore } from '@/stores/geolocation'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { useCidadeStore } from '@/stores/cidade'
import { useGeolocation } from '@/composables/useGeolocation'
import { useViaCep } from '@/composables/useViaCep'
import AppButton from '@/components/ui/AppButton.vue'
import AppField from '@/components/ui/AppField.vue'

const emit = defineEmits(['next'])

const geo = useGeolocationStore()
const ocorrencias = useOcorrenciasStore()
const cidadeStore = useCidadeStore()
const { pedirPermissao, geocodeAddress } = useGeolocation()
const { buscarCep } = useViaCep()

// fases: inicial | cep | preenchendo | manual | confirmando | confirmado
const fase = ref('inicial')
const carregando = ref(false)
const erro = ref('')
const miniMapEl = ref(null)
let miniMap = null
// coords sugeridas pelo geocoding (só aplicadas ao confirmar)
const sugestaoLat = ref(null)
const sugestaoLng = ref(null)
const cepInput = ref('')
const numero = ref('')
const complemento = ref('')

// Autocomplete de rua
const buscaRua = ref('')
const sugestoes = ref([])
const buscando = ref(false)
let debounceTimer = null

async function buscarRua(q) {
  if (q.length < 3) { sugestoes.value = []; return }
  buscando.value = true
  try {
    // Inclui a cidade selecionada na query pra enviesar o geocoding pra ela, e depois
    // reordena o resultado: mesmo com o viés, o Nominatim ainda pode devolver ruas
    // homônimas de outras cidades, então elas não devem ficar à frente das da cidade certa.
    const cidadeAtual = cidadeStore.cidadeAtual
    const query = [q, cidadeAtual.nome, cidadeAtual.uf, 'Brasil'].filter(Boolean).join(', ')
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: 'json', limit: 6, addressdetails: 1, countrycodes: 'br' },
      headers: { 'Accept-Language': 'pt-BR' },
    })
    sugestoes.value = data
      .map(item => ({
        label: item.display_name,
        rua: item.address.road ?? item.address.pedestrian ?? item.address.neighbourhood ?? '',
        bairro: item.address.suburb ?? item.address.neighbourhood ?? item.address.quarter ?? '',
        cidade: item.address.city ?? item.address.town ?? item.address.village ?? '',
        estado: item.address.state ?? '',
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }))
      .sort((a, b) =>
        (b.cidade === cidadeAtual.nome ? 1 : 0) - (a.cidade === cidadeAtual.nome ? 1 : 0)
      )
  } catch {
    sugestoes.value = []
  } finally {
    buscando.value = false
  }
}

function onBuscaInput(e) {
  buscaRua.value = e.target.value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => buscarRua(buscaRua.value), 400)
}

function selecionarSugestao(s) {
  geo.rua = s.rua
  geo.bairro = s.bairro
  geo.cidade = s.cidade
  geo.estado = s.estado
  sugestaoLat.value = s.lat
  sugestaoLng.value = s.lng
  buscaRua.value = s.label
  sugestoes.value = []
  // No desktop o pin é exibido no mapa principal (via geo store)
  // No mobile é exibido no mini mapa inline
  geo.setCoords({ lat: s.lat, lng: s.lng })
  fase.value = 'confirmando'
  nextTick(() => initMiniMap())
}

// Formata CEP enquanto digita: 00000-000
function formatarCep(valor) {
  const digits = valor.replace(/\D/g, '').slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function onCepInput(e) {
  cepInput.value = formatarCep(e.target.value)
}

// Dispara busca automática ao completar 8 dígitos
watch(cepInput, async (val) => {
  const digits = val.replace(/\D/g, '')
  if (digits.length !== 8) return
  carregando.value = true
  erro.value = ''
  try {
    const endereco = await buscarCep(val)
    geo.setEndereco(endereco)
    fase.value = 'preenchendo' // vai direto para campos restantes
  } catch (e) {
    erro.value = e.message || 'CEP não encontrado. Preencha manualmente.'
    fase.value = 'manual'
  } finally {
    carregando.value = false
  }
})

async function permitirGps() {
  carregando.value = true
  erro.value = ''
  try {
    await pedirPermissao()
    sugestaoLat.value = geo.lat
    sugestaoLng.value = geo.lng
    fase.value = 'confirmando'
    nextTick(() => initMiniMap())
  } catch {
    fase.value = 'cep'
  } finally {
    carregando.value = false
  }
}

function negarGps() {
  fase.value = 'cep'
}

function naoSeiCep() {
  fase.value = 'manual'
}

async function confirmarManual() {
  // Geocodifica em background sem tocar no store (evita watcher do mapa)
  sugestaoLat.value = -23.2237
  sugestaoLng.value = -45.9009
  carregando.value = true
  fase.value = 'confirmando'
  nextTick(() => initMiniMap())
  try {
    const { lat, lng } = await geocodeAddress({ rua: `${geo.rua} ${numero.value}`, bairro: geo.bairro, cidade: geo.cidade, estado: geo.estado })
    sugestaoLat.value = lat
    sugestaoLng.value = lng
    if (miniMap) miniMap.flyTo([lat, lng], 16, { duration: 1 })
    // Reposiciona marcador
    if (miniMap) {
      miniMap.eachLayer(l => { if (l instanceof L.Marker) l.setLatLng([lat, lng]) })
    }
  } catch {
    // Mantém centro padrão
  } finally {
    carregando.value = false
  }
}

// true quando o pin não caiu no número exato (seja por prédio próximo, seja pelo
// centro da rua) — StepLocalizacao avisa o usuário disso.
const numeroAproximado = ref(false)
// Número do prédio já mapeado no OSM que usamos como aproximação (null se não achou nenhum).
const numeroProximoEncontrado = ref(null)

// Busca no OSM (via Overpass) prédios já mapeados com addr:housenumber nesta rua, perto do
// ponto informado, e devolve o mais próximo NUMERICAMENTE do número procurado — ex.: procurando
// 695 sem essa casa mapeada, prefere o prédio 650 mapeado a deixar o pin solto no centro da via.
async function buscarNumeroProximo(numeroAlvo, rua, lat, lng) {
  const query = `[out:json][timeout:15];(node["addr:housenumber"]["addr:street"="${rua}"](around:700,${lat},${lng});way["addr:housenumber"]["addr:street"="${rua}"](around:700,${lat},${lng}););out center;`
  const { data } = await axios.post('https://overpass-api.de/api/interpreter', query, {
    headers: { 'Content-Type': 'text/plain' },
  })
  const candidatos = (data.elements ?? [])
    .map(el => {
      const num = parseInt(el.tags?.['addr:housenumber'], 10)
      const pos = el.type === 'node' ? { lat: el.lat, lng: el.lon } : el.center ? { lat: el.center.lat, lng: el.center.lon } : null
      return (Number.isNaN(num) || !pos) ? null : { numero: num, ...pos }
    })
    .filter(Boolean)
  if (!candidatos.length) return null
  candidatos.sort((a, b) => Math.abs(a.numero - numeroAlvo) - Math.abs(b.numero - numeroAlvo))
  return candidatos[0]
}

// Refina o pin com o número informado: re-geocodifica "rua + número" e move o marcador
// (mini mapa no mobile, mapa principal via geo store no desktop) pro ponto mais próximo.
async function refinarPorNumero() {
  if (!numero.value) return
  const numeroAlvo = parseInt(numero.value, 10)
  carregando.value = true
  numeroAproximado.value = false
  numeroProximoEncontrado.value = null
  try {
    const { lat, lng, exato } = await geocodeAddress({ rua: `${geo.rua} ${numero.value}`, bairro: geo.bairro, cidade: geo.cidade, estado: geo.estado })
    let pinLat = lat
    let pinLng = lng

    if (!exato && !Number.isNaN(numeroAlvo)) {
      const proximo = await buscarNumeroProximo(numeroAlvo, geo.rua, lat, lng).catch(() => null)
      if (proximo) {
        pinLat = proximo.lat
        pinLng = proximo.lng
        numeroProximoEncontrado.value = proximo.numero
      }
    }

    sugestaoLat.value = pinLat
    sugestaoLng.value = pinLng
    numeroAproximado.value = !exato
    geo.setCoords({ lat: pinLat, lng: pinLng })
    if (miniMap) {
      miniMap.flyTo([pinLat, pinLng], 17, { duration: 1 })
      miniMap.eachLayer(l => { if (l instanceof L.Marker) l.setLatLng([pinLat, pinLng]) })
    }
  } catch {
    // Não achou o número exato: mantém o pin onde estava (endereço/rua já confirmados)
  } finally {
    carregando.value = false
  }
}

function initMiniMap() {
  if (!miniMapEl.value) return
  if (miniMap) { miniMap.remove(); miniMap = null }

  const lat = sugestaoLat.value ?? -23.2237
  const lng = sugestaoLng.value ?? -45.9009
  miniMap = L.map(miniMapEl.value, { zoomControl: false, dragging: true, scrollWheelZoom: false }).setView([lat, lng], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap)

  const marker = L.marker([lat, lng], { draggable: true }).addTo(miniMap)
  marker.on('dragend', (e) => {
    const pos = e.target.getLatLng()
    sugestaoLat.value = pos.lat
    sugestaoLng.value = pos.lng
  })
}

async function confirmarPreenchimento() {
  // Re-geocodifica com número para refinar o pin no mapa
  if (numero.value) {
    geocodeAddress({ rua: `${geo.rua} ${numero.value}`, bairro: geo.bairro, cidade: geo.cidade, estado: geo.estado })
      .then(({ lat, lng }) => geo.setCoords({ lat, lng }))
      .catch(() => {})
  }
  continuar()
}

const enderecoResumo = computed(() => {
  const partes = [geo.rua, numero.value, complemento.value, geo.bairro, geo.cidade, geo.estado]
  return partes.filter(Boolean).join(', ')
})

function continuar() {
  const lat = sugestaoLat.value ?? geo.lat
  const lng = sugestaoLng.value ?? geo.lng
  if (lat && lng) geo.setCoords({ lat, lng })
  ocorrencias.rascunho.localizacao = {
    lat,
    lng,
    cep: geo.cep,
    rua: geo.rua,
    numero: numero.value,
    complemento: complemento.value,
    bairro: geo.bairro,
    cidade: geo.cidade,
    estado: geo.estado,
  }
  emit('next')
}
</script>

<template>
  <div class="flex flex-col gap-5 p-5">
    <h1 class="text-xl font-bold text-gray-800">Onde está o problema?</h1>

    <!-- Fase inicial: busca de endereço + GPS como alternativa -->
    <div v-if="fase === 'inicial'" class="flex flex-col gap-4">
      <!-- Campo de busca de endereço -->
      <div class="relative">
        <div class="relative">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">🔍</span>
          <input
            :value="buscaRua"
            type="text"
            placeholder="Buscar rua, bairro ou cidade..."
            autocomplete="off"
            class="w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition"
            @input="onBuscaInput"
          />
          <span v-if="buscando" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal text-base animate-spin">⟳</span>
        </div>

        <!-- Dropdown de sugestões -->
        <ul
          v-if="sugestoes.length"
          class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden"
        >
          <li
            v-for="s in sugestoes"
            :key="s.label"
            class="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-teal-soft border-b border-gray-100 last:border-0 leading-snug"
            @mousedown.prevent="selecionarSugestao(s)"
          >
            <span class="font-medium text-gray-900">{{ s.rua || s.label.split(',')[0] }}</span>
            <span class="block text-xs text-gray-400 mt-0.5">{{ [s.bairro, s.cidade, s.estado].filter(Boolean).join(', ') }}</span>
          </li>
        </ul>
      </div>

      <!-- Divisor -->
      <div class="flex items-center gap-3">
        <div class="flex-1 h-px bg-gray-100" />
        <span class="text-xs text-gray-400 font-medium">ou</span>
        <div class="flex-1 h-px bg-gray-100" />
      </div>

      <!-- GPS como alternativa: destacado em teal para chamar mais atenção que o campo de busca -->
      <button
        type="button"
        class="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border-2 border-teal bg-teal-soft text-sm font-bold text-teal-dark hover:bg-teal/10 transition-colors disabled:opacity-60"
        :disabled="carregando"
        @click="permitirGps"
      >
        <span class="text-base">📍</span>
        {{ carregando ? 'Obtendo localização...' : 'Usar minha localização atual' }}
      </button>
    </div>

    <!-- Fase CEP: campo com busca automática -->
    <div v-else-if="fase === 'cep'" class="flex flex-col gap-4">
      <div class="rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex gap-2.5 items-start">
        <span>🔍</span>
        <p class="text-xs text-gray-500 leading-relaxed">
          Digite o CEP — o endereço será preenchido automaticamente.
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-gray-600">CEP</label>
        <div class="relative">
          <input
            :value="cepInput"
            type="tel"
            inputmode="numeric"
            placeholder="00000-000"
            maxlength="9"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition pr-10"
            :class="erro ? 'border-red-400' : ''"
            @input="onCepInput"
          />
          <!-- Spinner dentro do campo -->
          <span
            v-if="carregando"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-teal text-xs animate-spin"
          >⟳</span>
          <span
            v-else-if="geo.rua && !erro"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm"
          >✓</span>
        </div>
        <p v-if="erro" class="text-xs text-red-500 mt-0.5">{{ erro }}</p>
      </div>

      <AppButton variant="ghost" @click="naoSeiCep">Buscar pelo nome da rua</AppButton>
    </div>

    <!-- Fase preenchendo: endereço encontrado, campos restantes -->
    <div v-else-if="fase === 'preenchendo'" class="flex flex-col gap-4">
      <!-- Endereço base (somente leitura) -->
      <div class="rounded-xl bg-teal-soft border border-teal-mid/40 p-3.5 flex gap-2.5">
        <span>✅</span>
        <div>
          <p class="text-xs font-bold text-teal-dark">Endereço encontrado</p>
          <p class="text-xs text-teal mt-0.5 leading-relaxed">
            {{ [geo.rua, geo.bairro, geo.cidade, geo.estado].filter(Boolean).join(', ') }}
          </p>
          <button
            type="button"
            class="text-[11px] text-teal underline mt-1"
            @click="fase = 'cep'"
          >Trocar CEP</button>
        </div>
      </div>

      <!-- Campos complementares -->
      <AppField v-model="numero" label="Número" placeholder="Ex: 123" />
      <AppField v-model="complemento" label="Complemento (opcional)" placeholder="Ex: Apto 4, Bloco B" />

      <AppButton @click="confirmarPreenchimento">Confirmar endereço</AppButton>
    </div>

    <!-- Fase manual: redireciona para busca inicial -->
    <div v-else-if="fase === 'manual'" class="flex flex-col gap-4">
      <div class="relative">
        <div class="relative">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">🔍</span>
          <input
            :value="buscaRua"
            type="text"
            placeholder="Buscar rua, bairro ou cidade..."
            autocomplete="off"
            class="w-full rounded-xl border border-gray-300 pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition"
            @input="onBuscaInput"
          />
          <span v-if="buscando" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal text-base animate-spin">⟳</span>
        </div>

        <ul
          v-if="sugestoes.length"
          class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden"
        >
          <li
            v-for="s in sugestoes"
            :key="s.label"
            class="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-teal-soft border-b border-gray-100 last:border-0 leading-snug"
            @mousedown.prevent="selecionarSugestao(s)"
          >
            <span class="font-medium text-gray-900">{{ s.rua || s.label.split(',')[0] }}</span>
            <span class="block text-xs text-gray-400 mt-0.5">{{ [s.bairro, s.cidade, s.estado].filter(Boolean).join(', ') }}</span>
          </li>
        </ul>
      </div>

      <AppButton variant="ghost" @click="fase = 'cep'">Informar pelo CEP</AppButton>
    </div>

    <!-- Fase confirmando: mapa com pin para o usuário confirmar -->
    <div v-else-if="fase === 'confirmando'" class="flex flex-col gap-4">
      <div class="rounded-xl bg-teal-soft border border-teal-mid/40 p-3.5 flex gap-2.5">
        <span>📍</span>
        <div>
          <p class="text-xs font-bold text-teal-dark">Localização sugerida</p>
          <p class="text-xs text-teal mt-0.5 leading-relaxed">{{ enderecoResumo || 'Endereço informado' }}</p>
        </div>
      </div>

      <!-- Número do endereço -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-gray-600">Número (opcional)</label>
        <div class="relative">
          <input
            v-model="numero"
            type="tel"
            inputmode="numeric"
            placeholder="Ex: 1234"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition pr-10"
            @change="refinarPorNumero"
          />
          <span v-if="carregando" class="absolute right-3 top-1/2 -translate-y-1/2 text-teal text-base animate-spin">⟳</span>
          <span v-else-if="numero" class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">✓</span>
        </div>
        <p v-if="numeroAproximado && numeroProximoEncontrado" class="text-[11px] text-amber-600">
          Número exato não mapeado — usamos o prédio nº {{ numeroProximoEncontrado }}, o mais próximo cadastrado nesta rua. Arraste o pin se necessário.
        </p>
        <p v-else-if="numeroAproximado" class="text-[11px] text-amber-600">
          Não encontramos o número exato nesta rua — o pin ficou no centro dela. Arraste-o para o local certo.
        </p>
        <p v-else class="text-[11px] text-gray-400">Preencha para posicionar o pin no número exato.</p>
      </div>

      <!-- Mobile: mini mapa inline -->
      <p class="lg:hidden text-xs text-gray-500">Verifique o pin no mapa. Se necessário, arraste-o para o local correto.</p>
      <div ref="miniMapEl" class="lg:hidden w-full rounded-2xl overflow-hidden border border-gray-200" style="height: 220px;" />

      <!-- Desktop: dica de que o pin está no mapa à esquerda -->
      <div class="hidden lg:flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-200 p-3.5">
        <span>🗺️</span>
        <p class="text-xs text-gray-500 leading-relaxed">Verifique o pin no mapa à esquerda. Se necessário, arraste-o para o local exato.</p>
      </div>

      <AppButton :disabled="carregando" @click="continuar">Confirmar localização</AppButton>
      <button type="button" class="text-xs text-gray-400 text-center" @click="fase = 'inicial'">
        Corrigir endereço
      </button>
    </div>

    <!-- Fase confirmado -->
    <div v-else-if="fase === 'confirmado'" class="flex flex-col gap-4">
      <div class="rounded-xl border border-teal-mid bg-teal-soft p-3.5">
        <p class="text-sm font-bold text-teal-dark">Localização confirmada</p>
        <p class="text-xs text-teal mt-1 leading-relaxed">{{ enderecoResumo || 'Localização aproximada' }}</p>
      </div>
      <AppButton @click="continuar">Continuar</AppButton>
      <button type="button" class="text-xs text-gray-400 text-center" @click="fase = 'cep'">
        Corrigir endereço
      </button>
    </div>
  </div>
</template>

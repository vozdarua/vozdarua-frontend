<script setup>
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <aside class="hidden lg:flex lg:w-72 bg-teal-dark flex-col p-8 gap-6 min-h-screen sticky top-0 text-white">
      <div class="flex items-center gap-1.5 text-xl font-extrabold">
        Voz da Rua
      </div>
      <p class="text-sm text-teal-mid leading-relaxed">
        A voz da sua cidade.
      </p>
    </aside>

    <main class="flex-1 max-w-md w-full mx-auto flex flex-col lg:border-r border-gray-200 min-h-screen p-6 gap-8 justify-center">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex items-center gap-1.5 text-2xl font-extrabold">
          Voz da Rua
        </div>
        <p class="text-sm text-gray-500 max-w-xs">
          Registre problemas da sua cidade e faça sua voz ser ouvida.
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <AppButton @click="router.push('/app/registrar')">Registrar uma ocorrência</AppButton>
        <AppButton variant="outline" @click="router.push('/app/mapa')">Ver mapa da cidade</AppButton>
      </div>
    </main>

    <aside class="hidden lg:flex flex-col flex-1 max-w-md p-10 gap-6">
      <h2 class="text-lg font-bold text-gray-800">Sua voz importa</h2>
      <p class="text-sm text-gray-500 leading-relaxed">
        Cada ocorrência registrada ajuda o poder público a priorizar melhorias na sua cidade.
      </p>
    </aside>
  </div>
</template>

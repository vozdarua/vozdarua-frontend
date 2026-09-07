<script setup>
// A API atual não expõe um endpoint para listar as ocorrências do
// usuário logado (GET /issues/reporter/{id} é restrito a ADMIN e o
// schema de Issue não retorna o autor). Mantido como placeholder
// até que esse endpoint exista.
</script>

<template>
  <div class="flex flex-col gap-3 p-5">
    <h1 class="text-lg font-bold text-gray-800">Minhas ocorrências</h1>
    <p class="text-sm text-gray-400 text-center py-10">
      Essa funcionalidade ainda não está disponível na API atual.
    </p>
  </div>
</template>

<template>
  <div class="max-w-2xl mx-auto px-5 py-8 pb-24 lg:pb-8">

    <!-- Hero -->
    <div class="mb-8">
      <div class="w-16 h-16 rounded-3xl bg-teal/10 flex items-center justify-center text-3xl mb-4">🗣️</div>
      <h1 class="text-2xl font-extrabold text-gray-900 mb-2">O que é o Voz da Rua?</h1>
      <p class="text-gray-500 text-sm leading-relaxed">
        Uma plataforma cidadã para registrar, acompanhar e pressionar por soluções para problemas urbanos.
      </p>
    </div>

    <!-- Missão -->
    <section class="mb-8 bg-teal/5 rounded-3xl p-6 border border-teal/10">
      <h2 class="text-base font-bold text-gray-800 mb-3">Nossa missão</h2>
      <p class="text-sm text-gray-600 leading-relaxed">
        Dar voz à população da região do Vale do Paraíba para que buracos nas ruas, falta de iluminação,
        descarte irregular de lixo e tantos outros problemas deixem de ser ignorados. Cada ocorrência
        registrada é um dado público que pressiona o poder local a agir.
      </p>
    </section>

    <!-- Como funciona -->
    <section class="mb-8">
      <h2 class="text-base font-bold text-gray-800 mb-4">Como funciona</h2>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-start">
          <div class="w-9 h-9 rounded-2xl bg-teal text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Registre uma ocorrência</p>
            <p class="text-sm text-gray-500 mt-0.5">Fotografe o problema, indique o endereço e selecione a categoria.</p>
          </div>
        </div>
        <div class="flex gap-4 items-start">
          <div class="w-9 h-9 rounded-2xl bg-teal text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
          <div>
            <p class="text-sm font-semibold text-gray-800">A comunidade confirma</p>
            <p class="text-sm text-gray-500 mt-0.5">Outros moradores podem confirmar que o problema existe, aumentando a prioridade.</p>
          </div>
        </div>
        <div class="flex gap-4 items-start">
          <div class="w-9 h-9 rounded-2xl bg-teal text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Acompanhe a resolução</p>
            <p class="text-sm text-gray-500 mt-0.5">O status é atualizado à medida que o problema é analisado e resolvido.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Grupo Tapioca -->
    <section class="mb-8">
      <h2 class="text-base font-bold text-gray-800 mb-1">Grupo Tapioca</h2>
      <p class="text-sm text-gray-500 leading-relaxed mb-5">
        O Voz da Rua nasceu de uma conversa entre amigos no grupo <span class="font-semibold text-gray-700">Tapioca</span> — um
        coletivo informal de pessoas que acreditam que tecnologia pode melhorar a vida nas cidades.
        Sem financiamento público, sem política partidária. Só vontade de fazer algo útil.
      </p>

      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
          <div class="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-base font-bold text-teal">M</div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800">Marcell Marra</p>
            <p class="text-xs text-gray-400">Produto & desenvolvimento</p>
          </div>
          <a href="https://www.linkedin.com/in/marcell-marra/" target="_blank" rel="noopener" aria-label="LinkedIn de Marcell Marra" class="text-gray-400 hover:text-[#0A66C2] flex-shrink-0">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z"/></svg>
          </a>
        </div>
        <div class="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
          <div class="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-base font-bold text-violet-500">PH</div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800">Pedro Hos</p>
            <p class="text-xs text-gray-400">Produto & desenvolvimento</p>
          </div>
          <a href="https://www.linkedin.com/in/pedrohosilva/" target="_blank" rel="noopener" aria-label="LinkedIn de Pedro Hos" class="text-gray-400 hover:text-[#0A66C2] flex-shrink-0">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z"/></svg>
          </a>
        </div>
        <div class="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
          <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-base font-bold text-amber-500">PL</div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800">Pedro Leite</p>
            <p class="text-xs text-gray-400">Tecnologia & dados</p>
          </div>
          <a href="https://www.linkedin.com/in/pedro-valentim-tech/" target="_blank" rel="noopener" aria-label="LinkedIn de Pedro Leite" class="text-gray-400 hover:text-[#0A66C2] flex-shrink-0">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z"/></svg>
          </a>
        </div>
        <div class="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base">🙌</div>
          <div>
            <p class="text-sm font-semibold text-gray-800">E outros colaboradores</p>
            <p class="text-xs text-gray-400">Que acreditam na ideia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Rodapé -->
    <p class="text-xs text-gray-400 text-center">
      Feito com 💚 em São José dos Campos · {{ new Date().getFullYear() }}
    </p>
  </div>
</template>

# Voz da Rua — Frontend (Vue 3 PWA)

Plataforma cívica de fiscalização urbana da organização **Tapioca**.

## Stack

Vue 3 (Composition API) · Vite · vite-plugin-pwa · Vue Router 4 · Pinia · Axios · Tailwind CSS 3 · HeadlessUI Vue · VeeValidate + Zod · Leaflet

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API backend (Quarkus) |
| `VITE_APP_NAME` | Nome da aplicação |
| `VITE_NOMINATIM_URL` | Geocoding reverso (GPS → endereço) — único uso de API externa direta; CEP é resolvido pelo próprio backend |

## Build

```bash
npm run build    # gera dist/
npm run preview  # testa o build localmente
```

## Ícones PWA

Adicione `icon-192.png` e `icon-512.png` em `public/icons/` antes de publicar — o manifest em `vite.config.js` já referencia esses caminhos.

## Deploy

Hospedado em **Cloudflare Workers** (config em `wrangler.jsonc`). Deploy automático via
Cloudflare git integration a cada push em `main`; não há GitHub Actions publicando.

```bash
npm run deploy   # build + wrangler deploy (uso manual/local)
```

`VITE_API_URL` de produção é setada à mão no painel do Cloudflare (build env var) — não existe
proxy do Vite fora do dev local, então precisa ser a URL absoluta do backend.

## API — pontos importantes (validado contra o OpenAPI real)

A camada de serviços (`src/services/*.js`) foi conferida contra `GET /q/openapi?format=json` do backend de teste. Pontos que diferem do que normalmente se espera de uma API REST:

- **Autenticação é HTTP Basic, não JWT.** Não existe endpoint de login. `POST /user` cria a conta (sem devolver token); as credenciais (`email:senha` em base64) ficam em `localStorage` e são enviadas em todo request autenticado. "Entrar" significa apenas validar as credenciais chamando `GET /user/me`.
- **Categorias, severidades e status já vêm seedados no backend** com os mesmos ids/nomes/ícones do protótipo (`GET /categories`, `GET /severity`, `GET /status`). `StepCategoria.vue` busca da API e usa a lista local só como fallback instantâneo.
- **CEP é resolvido no backend**: `GET /location/cep/{cep}` — não chamamos `viacep.com.br` diretamente.
- **Não existe endpoint de "resolver"** uma ocorrência — atualiza-se via `PUT /issues/{id}` com `status: { id: 2 }` (Resolvido).
- **Sem suporte a comentários, métricas, ranking ou alertas** na API atual. As telas correspondentes (`RankingView`, `AlertasView`, `MinhasView`) mostram um placeholder "não disponível" em vez de chamar endpoints inexistentes.
- `GET /issues/reporter/{reporterId}` (que seria "minhas ocorrências") exige role `ADMIN` e o schema de `Issue` não expõe o autor — por isso não há como listar as ocorrências do usuário logado hoje.

Esses pontos devem ser revisitados conforme o backend evoluir.

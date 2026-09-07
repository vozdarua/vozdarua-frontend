import { defineStore } from 'pinia'

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const TODAS_CIDADES = [
  { id: 'sjc',             nome: 'São José dos Campos',    uf: 'SP', lat: -23.2237, lng: -45.9009 },
  { id: 'jacarei',         nome: 'Jacareí',                uf: 'SP', lat: -23.3047, lng: -45.9659 },
  { id: 'cacapava',        nome: 'Caçapava',               uf: 'SP', lat: -23.1018, lng: -45.7084 },
  { id: 'taubate',         nome: 'Taubaté',                uf: 'SP', lat: -23.0264, lng: -45.5553 },
  { id: 'monteiro-lobato', nome: 'Monteiro Lobato',        uf: 'SP', lat: -22.9543, lng: -45.8378 },
  { id: 'jambeiro',        nome: 'Jambeiro',               uf: 'SP', lat: -23.2513, lng: -45.6952 },
  { id: 'santa-branca',    nome: 'Santa Branca',           uf: 'SP', lat: -23.3965, lng: -45.8835 },
  { id: 'tremembre',       nome: 'Tremembé',               uf: 'SP', lat: -22.9607, lng: -45.5494 },
  { id: 'pindamonhangaba', nome: 'Pindamonhangaba',        uf: 'SP', lat: -22.9239, lng: -45.4614 },
  { id: 'paraibuna',       nome: 'Paraibuna',              uf: 'SP', lat: -23.3835, lng: -45.6629 },
  { id: 'guararema',       nome: 'Guararema',              uf: 'SP', lat: -23.4150, lng: -46.0336 },
  { id: 'salesopolis',     nome: 'Salesópolis',            uf: 'SP', lat: -23.5291, lng: -45.8443 },
  { id: 'campos-jordao',   nome: 'Campos do Jordão',       uf: 'SP', lat: -22.7393, lng: -45.5913 },
  { id: 'lorena',          nome: 'Lorena',                 uf: 'SP', lat: -22.7281, lng: -45.1236 },
  { id: 'guaratingueta',   nome: 'Guaratinguetá',          uf: 'SP', lat: -22.8163, lng: -45.1919 },
  { id: 'aparecida',       nome: 'Aparecida',              uf: 'SP', lat: -22.8474, lng: -45.2328 },
  { id: 'cruzeiro',        nome: 'Cruzeiro',               uf: 'SP', lat: -22.5797, lng: -44.9611 },
  { id: 'sp',              nome: 'São Paulo',               uf: 'SP', lat: -23.5505, lng: -46.6333 },
  { id: 'campinas',        nome: 'Campinas',               uf: 'SP', lat: -22.9056, lng: -47.0608 },
  { id: 'sorocaba',        nome: 'Sorocaba',               uf: 'SP', lat: -23.5015, lng: -47.4526 },
  { id: 'santos',          nome: 'Santos',                 uf: 'SP', lat: -23.9608, lng: -46.3336 },
  { id: 'sbc',             nome: 'São Bernardo do Campo',  uf: 'SP', lat: -23.6939, lng: -46.5650 },
  { id: 'osasco',          nome: 'Osasco',                 uf: 'SP', lat: -23.5327, lng: -46.7916 },
  { id: 'ribeirao-preto',  nome: 'Ribeirão Preto',         uf: 'SP', lat: -21.1699, lng: -47.8100 },
  { id: 'sao-jose-rc',     nome: 'São José do Rio Preto',  uf: 'SP', lat: -20.8113, lng: -49.3758 },
  { id: 'mogi-cruzes',     nome: 'Mogi das Cruzes',        uf: 'SP', lat: -23.5228, lng: -46.1875 },
  { id: 'sjb-vista',       nome: 'São João da Boa Vista',  uf: 'SP', lat: -21.9712, lng: -46.7948 },
  { id: 'rj',              nome: 'Rio de Janeiro',          uf: 'RJ', lat: -22.9068, lng: -43.1729 },
  { id: 'niteroi',         nome: 'Niterói',                uf: 'RJ', lat: -22.8832, lng: -43.1036 },
  { id: 'volta-redonda',   nome: 'Volta Redonda',          uf: 'RJ', lat: -22.5233, lng: -44.1040 },
  { id: 'petrópolis',      nome: 'Petrópolis',             uf: 'RJ', lat: -22.5050, lng: -43.1783 },
  { id: 'bh',              nome: 'Belo Horizonte',         uf: 'MG', lat: -19.9167, lng: -43.9345 },
  { id: 'uberlandia',      nome: 'Uberlândia',             uf: 'MG', lat: -18.9186, lng: -48.2772 },
  { id: 'juiz-de-fora',    nome: 'Juiz de Fora',           uf: 'MG', lat: -21.7609, lng: -43.3504 },
  { id: 'contagem',        nome: 'Contagem',               uf: 'MG', lat: -19.9317, lng: -44.0536 },
  { id: 'curitiba',        nome: 'Curitiba',               uf: 'PR', lat: -25.4284, lng: -49.2733 },
  { id: 'londrina',        nome: 'Londrina',               uf: 'PR', lat: -23.3045, lng: -51.1696 },
  { id: 'maringa',         nome: 'Maringá',                uf: 'PR', lat: -23.4205, lng: -51.9331 },
  { id: 'foz-iguacu',      nome: 'Foz do Iguaçu',          uf: 'PR', lat: -25.5478, lng: -54.5882 },
  { id: 'porto-alegre',    nome: 'Porto Alegre',           uf: 'RS', lat: -30.0346, lng: -51.2177 },
  { id: 'caxias-sul',      nome: 'Caxias do Sul',          uf: 'RS', lat: -29.1678, lng: -51.1794 },
  { id: 'pelotas',         nome: 'Pelotas',                uf: 'RS', lat: -31.7717, lng: -52.3422 },
  { id: 'florianopolis',   nome: 'Florianópolis',          uf: 'SC', lat: -27.5954, lng: -48.5480 },
  { id: 'joinville',       nome: 'Joinville',              uf: 'SC', lat: -26.3044, lng: -48.8487 },
  { id: 'blumenau',        nome: 'Blumenau',               uf: 'SC', lat: -26.9195, lng: -49.0661 },
  { id: 'salvador',        nome: 'Salvador',               uf: 'BA', lat: -12.9714, lng: -38.5014 },
  { id: 'feira-santana',   nome: 'Feira de Santana',       uf: 'BA', lat: -12.2664, lng: -38.9663 },
  { id: 'recife',          nome: 'Recife',                 uf: 'PE', lat: -8.0578,  lng: -34.8829 },
  { id: 'caruaru',         nome: 'Caruaru',                uf: 'PE', lat: -8.2760,  lng: -35.9761 },
  { id: 'fortaleza',       nome: 'Fortaleza',              uf: 'CE', lat: -3.7319,  lng: -38.5267 },
  { id: 'natal',           nome: 'Natal',                  uf: 'RN', lat: -5.7945,  lng: -35.2110 },
  { id: 'manaus',          nome: 'Manaus',                 uf: 'AM', lat: -3.1190,  lng: -60.0217 },
  { id: 'belem',           nome: 'Belém',                  uf: 'PA', lat: -1.4558,  lng: -48.5044 },
  { id: 'goiania',         nome: 'Goiânia',                uf: 'GO', lat: -16.6869, lng: -49.2648 },
  { id: 'anapolis',        nome: 'Anápolis',               uf: 'GO', lat: -16.3281, lng: -48.9535 },
  { id: 'brasilia',        nome: 'Brasília',               uf: 'DF', lat: -15.7801, lng: -47.9292 },
  { id: 'campo-grande',    nome: 'Campo Grande',           uf: 'MS', lat: -20.4697, lng: -54.6201 },
  { id: 'cuiaba',          nome: 'Cuiabá',                 uf: 'MT', lat: -15.6014, lng: -56.0979 },
  { id: 'porto-velho',     nome: 'Porto Velho',            uf: 'RO', lat: -8.7612,  lng: -63.9004 },
  { id: 'macapa',          nome: 'Macapá',                 uf: 'AP', lat: 0.0349,   lng: -51.0694 },
  { id: 'boa-vista',       nome: 'Boa Vista',              uf: 'RR', lat: 2.8197,   lng: -60.6733 },
  { id: 'maceio',          nome: 'Maceió',                 uf: 'AL', lat: -9.6658,  lng: -35.7350 },
  { id: 'aracaju',         nome: 'Aracaju',                uf: 'SE', lat: -10.9472, lng: -37.0731 },
  { id: 'teresina',        nome: 'Teresina',               uf: 'PI', lat: -5.0892,  lng: -42.8019 },
  { id: 'joao-pessoa',     nome: 'João Pessoa',            uf: 'PB', lat: -7.1195,  lng: -34.8450 },
  { id: 'sao-luis',        nome: 'São Luís',               uf: 'MA', lat: -2.5297,  lng: -44.3028 },
  { id: 'vitoria',         nome: 'Vitória',                uf: 'ES', lat: -20.3155, lng: -40.3128 },
  { id: 'vila-velha',      nome: 'Vila Velha',             uf: 'ES', lat: -20.3297, lng: -40.2920 },
  { id: 'rio-branco',      nome: 'Rio Branco',             uf: 'AC', lat: -9.9754,  lng: -67.8249 },
  { id: 'palmas',          nome: 'Palmas',                 uf: 'TO', lat: -10.1839, lng: -48.3336 },
]

export const CIDADES = TODAS_CIDADES.filter(c =>
  ['sjc', 'jacarei', 'taubate'].includes(c.id)
)

export function cidadesProximas(cidade, n = 5) {
  return TODAS_CIDADES
    .filter(c => c.id !== cidade.id)
    .map(c => ({ ...c, distKm: Math.round(haversineKm(cidade.lat, cidade.lng, c.lat, c.lng)) }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, n)
}

export const useCidadeStore = defineStore('cidade', {
  state: () => ({
    cidadeAtual: TODAS_CIDADES[0],
  }),
  actions: {
    trocar(id) {
      const cidade = TODAS_CIDADES.find(c => c.id === id)
      if (cidade) this.cidadeAtual = cidade
    },
  },
})

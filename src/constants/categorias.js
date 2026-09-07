export const CATEGORIAS = [
  // Infraestrutura urbana
  { id: 'buraco_asfalto', e: '🕳️', l: 'Buraco no asfalto', ex: 'Cratera na rua, remendo solto, asfalto afundado', tags: ['buraco', 'asfalto', 'cova', 'cratera', 'remendo', 'via', 'pista'] },
  { id: 'calcada', e: '🚶', l: 'Calçada danificada', ex: 'Piso quebrado, desnível, falta de rampa de acessibilidade', tags: ['calçada', 'passeio', 'piso', 'meio-fio', 'acessibilidade', 'rampa'] },
  { id: 'iluminacao', e: '💡', l: 'Iluminação pública', ex: 'Poste apagado, lâmpada queimada, rua escura à noite', tags: ['luz', 'poste', 'lâmpada', 'iluminação', 'escuro', 'apagado'] },
  { id: 'sinalizacao', e: '🚦', l: 'Sinalização e trânsito', ex: 'Semáforo quebrado, placa faltando, faixa apagada, lombada sem placa', tags: ['semáforo', 'placa', 'faixa', 'sinalização', 'trânsito', 'lombada', 'pare'] },
  { id: 'agua_esgoto', e: '💧', l: 'Água e esgoto', ex: "Vazamento, esgoto a céu aberto, falta d'água, bueiro entupido", tags: ['água', 'esgoto', 'vazamento', 'bueiro', 'fossa', 'encanamento', 'hidrante', 'cano'] },
  // Crise climática e riscos
  { id: 'alagamento', e: '🌊', l: 'Alagamento e enchente', ex: 'Rua alagada na chuva, valão transbordando, sarjeta entupida', tags: ['alagamento', 'enchente', 'inundação', 'chuva', 'dreno', 'sarjeta', 'valão', 'água'] },
  { id: 'deslizamento', e: '⛰️', l: 'Risco de deslizamento', ex: 'Encosta instável, erosão, talude sem contenção, morro com rachaduras', tags: ['deslizamento', 'encosta', 'morro', 'talude', 'erosão', 'desmoronamento', 'chuva', 'risco', 'terra'] },
  { id: 'arvore_risco', e: '🌳', l: 'Árvore de risco', ex: 'Árvore inclinada, galho sobre fio elétrico, raiz levantando calçada', tags: ['árvore', 'galho', 'fio', 'raiz', 'inclinada', 'queda', 'poda', 'vegetação', 'risco'] },
  { id: 'calor', e: '🌡️', l: 'Ilha de calor e sombra', ex: 'Ausência de árvores, praça sem sombreamento, asfalto excessivo', tags: ['calor', 'sombra', 'árvore', 'temperatura', 'ilha de calor', 'sombreamento', 'vegetação'] },
  { id: 'queimada', e: '🔥', l: 'Queimada e poluição do ar', ex: 'Fogo em terreno baldio, queima de lixo, fumaça em área urbana', tags: ['queimada', 'fogo', 'fumaça', 'poluição', 'ar', 'incêndio', 'terreno'] },
  // Segurança
  { id: 'area_insegura', e: '🚨', l: 'Área insegura', ex: 'Ponto de tráfico, beco sem iluminação, local de crime frequente', tags: ['inseguro', 'tráfico', 'crime', 'perigo', 'beco', 'risco', 'violência', 'assalto', 'área'] },
  { id: 'seguranca_infra', e: '🔦', l: 'Infraestrutura de segurança', ex: 'Câmera quebrada, guarita abandonada, cerca danificada', tags: ['câmera', 'segurança', 'guarita', 'cerca', 'vigilância', 'cftv', 'monitoramento'] },
  { id: 'ilum_ausente', e: '⚫', l: 'Rua sem iluminação', ex: 'Trecho totalmente sem luz, poste inexistente, área perigosa à noite', tags: ['escuro', 'sem luz', 'poste', 'noite', 'perigoso', 'iluminação', 'rua'] },
  // Lixo e meio ambiente
  { id: 'lixo', e: '🗑️', l: 'Lixo e entulho', ex: 'Entulho abandonado, lixo acumulado, descarte irregular', tags: ['lixo', 'entulho', 'lixão', 'descarte', 'sujeira', 'resíduo', 'coleta'] },
  { id: 'meio_ambiente', e: '🌿', l: 'Poluição e meio ambiente', ex: 'Descarte em rio, córrego poluído, desmatamento em área verde', tags: ['meio ambiente', 'rio', 'córrego', 'poluição', 'queimada', 'desmatamento', 'esgoto'] },
  { id: 'dengue', e: '🦟', l: 'Foco de dengue / mosquito', ex: 'Água parada, pneu, entulho, vasilhame, calha entupida com água', tags: ['dengue', 'mosquito', 'aedes', 'água parada', 'larva', 'foco', 'pneu', 'zika', 'chikungunya'] },
  // Saúde e serviços
  { id: 'saude', e: '🏥', l: 'Saúde pública', ex: 'UBS fechada, falta de médico, vacina em falta, longa espera', tags: ['saúde', 'ubs', 'posto', 'médico', 'vacina', 'fila', 'atendimento', 'doença'] },
  { id: 'escola', e: '🏫', l: 'Escola e educação', ex: 'Escola sem professor, infiltração, falta de merenda, estrutura ruim', tags: ['escola', 'creche', 'professor', 'merenda', 'educação', 'ensino', 'aluno'] },
  { id: 'transporte', e: '🚌', l: 'Transporte público', ex: 'Ônibus não passa, ponto sem cobertura, horário errado', tags: ['ônibus', 'transporte', 'ponto', 'van', 'parada', 'itinerário', 'linha', 'bus'] },
  // Espaços e ocupação
  { id: 'praca_parque', e: '🏞️', l: 'Praça e parque', ex: 'Brinquedo quebrado, banco danificado, iluminação ruim, mato alto', tags: ['praça', 'parque', 'jardim', 'brinquedo', 'quadra', 'lazer', 'banco'] },
  { id: 'espaco', e: '🏚️', l: 'Espaço público degradado', ex: 'Praça abandonada, área pública sem manutenção, terreno baldio', tags: ['praça', 'abandonada', 'degradado', 'construção', 'terreno', 'baldio', 'manutenção', 'área pública'] },
  { id: 'ocupacao', e: '⚠️', l: 'Ocupação irregular', ex: 'Construção irregular, comércio na calçada, barraco em área pública', tags: ['irregular', 'invasão', 'construção', 'barraco', 'camelô', 'ambulante'] },
  // Animais
  { id: 'animais', e: '🐕', l: 'Animais e zoonoses', ex: 'Cães soltos, animais abandonados, foco de escorpião, pombos', tags: ['animal', 'cachorro', 'gato', 'escorpião', 'pombo', 'abandono', 'zoonose', 'rato'] },
  // Outros
  { id: 'barulho', e: '🔊', l: 'Barulho e perturbação', ex: 'Som alto em horário proibido, obra noturna, bar perturbando', tags: ['barulho', 'som', 'ruído', 'perturbação', 'obra', 'vizinho', 'festa', 'poluição sonora'] },
  { id: 'acessibilidade', e: '♿', l: 'Acessibilidade', ex: 'Sem rampa, calçada obstruída, banheiro inacessível, elevador quebrado', tags: ['acessibilidade', 'rampa', 'deficiente', 'cadeira de rodas', 'pcd', 'elevador', 'calçada'] },
  { id: 'outro', e: '📋', l: 'Outro problema', ex: 'Qualquer situação que não se encaixa nas categorias acima', tags: ['outro', 'outros', 'diferente', 'diverso'] },
]

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function searchCategorias(query) {
  if (!query?.trim()) return CATEGORIAS
  const q = normalize(query)
  return CATEGORIAS.filter((cat) => {
    if (normalize(cat.l).includes(q)) return true
    return cat.tags.some((tag) => normalize(tag).includes(q))
  })
}

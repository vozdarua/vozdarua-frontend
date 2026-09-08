import { computed } from 'vue'

// Deriva os valores usados pelos painéis de métricas (CityMetricsSheet/Sidebar) a
// partir do CityMetricsDTO vindo de GET /issues/metrics - antes essa mesma lógica
// era duplicada nos dois componentes, calculada no client sobre a lista inteira
// de ocorrências da cidade.
export function useCityMetricsBreakdown(metricasRef) {
  const total = computed(() => metricasRef.value?.total ?? 0)

  const porStatus = computed(() =>
    Object.fromEntries((metricasRef.value?.byStatus ?? []).map((s) => [s.name, s.count]))
  )

  const resolvidas = computed(() => porStatus.value['Resolvido'] ?? 0)
  const taxaResolucao = computed(() =>
    total.value > 0 ? Math.round((resolvidas.value / total.value) * 100) : 0
  )

  const porCategoria = computed(() => (metricasRef.value?.byCategory ?? []).map((c) => [c.name, c.count]))
  const porBairro = computed(() => (metricasRef.value?.byNeighborhood ?? []).map((b) => [b.name, b.count]))

  return { total, porStatus, resolvidas, taxaResolucao, porCategoria, porBairro }
}

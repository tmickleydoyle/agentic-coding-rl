'use client'
import { useApp } from '../../components/AppStateProvider'
import { changePct, isOnTrack, trendOf } from '../../hooks/useKpis'

export default function KpiDetailPage() {
  const { kpis, selectedId } = useApp()
  const kpi = kpis.find((k) => k.id === selectedId) ?? null
  if (!kpi) {
    return (
      <section data-testid="page-kpi-detail">
        <p data-testid="no-selection">No KPI selected.</p>
      </section>
    )
  }
  return (
    <section data-testid="page-kpi-detail">
      <h1 data-testid="detail-name">{kpi.name}</h1>
      <p data-testid="detail-current">{kpi.current}</p>
      <p data-testid="detail-previous">{kpi.previous}</p>
      <p data-testid="detail-target">{kpi.target}</p>
      <p data-testid="detail-unit">{kpi.unit}</p>
      <p data-testid="detail-status">{isOnTrack(kpi) ? 'on-track' : 'off-track'}</p>
      <p data-testid="detail-trend">{trendOf(kpi)}</p>
      <p data-testid="detail-change">{changePct(kpi)}</p>
      <ul data-testid="detail-history">
        {kpi.history.map((v, i) => (
          <li key={i} data-testid={`detail-history-${i}`}>
            {v}
          </li>
        ))}
      </ul>
    </section>
  )
}

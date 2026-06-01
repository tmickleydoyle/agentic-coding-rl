'use client'
import { useApp } from '../../components/AppStateProvider'
import { useKpis } from '../../hooks/useKpis'
import KpiCard from '../../components/KpiCard'

export default function DashboardPage() {
  const { selectKpi } = useApp()
  const { kpis, onTrack, offTrack } = useKpis()
  return (
    <section data-testid="page-dashboard">
      <h1>KPI Dashboard</h1>
      <div data-testid="summary">
        <span data-testid="summary-ontrack">{onTrack}</span>
        <span data-testid="summary-offtrack">{offTrack}</span>
        <span data-testid="summary-total">{kpis.length}</span>
      </div>
      <ul data-testid="kpi-list">
        {kpis.map((k) => (
          <KpiCard key={k.id} kpi={k} onOpen={selectKpi} />
        ))}
      </ul>
    </section>
  )
}

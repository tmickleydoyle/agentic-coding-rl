'use client'
import { useApp } from '../../components/AppStateProvider'
import { useOkr } from '../../hooks/useOkr'
import { objectiveProgress } from '../../lib/progress'

export default function DashboardPage() {
  const { objectives } = useApp()
  const { company } = useOkr()
  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <span data-testid="company-progress">{company}</span>
      <span data-testid="objective-count">{objectives.length}</span>
      <ul data-testid="dashboard-list">
        {objectives.map((o) => (
          <li key={o.id} data-testid={`dashboard-${o.id}`}>
            <span data-testid={`dashboard-${o.id}-title`}>{o.title}</span>
            <span data-testid={`dashboard-${o.id}-progress`}>{objectiveProgress(o)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

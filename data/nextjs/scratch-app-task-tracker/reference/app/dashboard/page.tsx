'use client'
import { useApp } from '../../components/AppStateProvider'
import { useTasks } from '../../hooks/useTasks'
import StatCard from '../../components/StatCard'

export default function DashboardPage() {
  const { projects } = useApp()
  const { counts } = useTasks()
  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={counts.total} testid="total" />
        <StatCard label="Completed" value={counts.completed} testid="completed" />
        <StatCard label="Active" value={counts.active} testid="active" />
      </div>
      <ul data-testid="project-counts">
        {projects.map((p) => (
          <li key={p.id} data-testid={`project-count-${p.id}`}>
            <span data-testid={`project-count-${p.id}-name`}>{p.name}</span>
            <span data-testid={`project-count-${p.id}-value`}>
              {counts.byProject[p.id] ?? 0}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

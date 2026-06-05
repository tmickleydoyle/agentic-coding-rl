'use client'
import { useSla } from '../../hooks/useSla'
import StatCard from '../../components/StatCard'

export default function DashboardPage() {
  const { counts } = useSla()
  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={counts.total} testid="total" />
        <StatCard label="Breached" value={counts.breached} testid="breached" />
        <StatCard label="Responded" value={counts.responded} testid="responded" />
        <StatCard label="Escalated" value={counts.escalated} testid="escalated" />
      </div>
    </section>
  )
}

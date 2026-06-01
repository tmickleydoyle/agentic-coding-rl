'use client'
import { useInvoices } from '../../components/AppStateProvider'
import { useInvoiceStats } from '../../hooks/useInvoiceStats'
import StatCard from '../../components/StatCard'
import { STATUSES } from '../../lib/types'

export default function DashboardPage() {
  const { theme, setTheme } = useInvoices()
  const { stats } = useInvoiceStats()
  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={stats.total} testid="total" />
        <StatCard label="Outstanding" value={stats.outstanding} testid="outstanding" />
        <StatCard label="Paid" value={stats.paid} testid="paid" />
        <StatCard label="Overdue" value={stats.overdue} testid="overdue" />
      </div>
      <ul data-testid="status-counts">
        {STATUSES.map((s) => (
          <li key={s} data-testid={`status-count-${s}`}>
            <span data-testid={`status-count-${s}-name`}>{s}</span>
            <span data-testid={`status-count-${s}-value`}>{stats.byStatus[s]}</span>
          </li>
        ))}
      </ul>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </section>
  )
}

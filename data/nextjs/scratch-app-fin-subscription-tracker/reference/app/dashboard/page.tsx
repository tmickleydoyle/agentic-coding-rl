'use client'
import { useSubs } from '../../components/SubsProvider'
import { useSubsSummary } from '../../hooks/useSubs'
import StatCard from '../../components/StatCard'

export default function DashboardPage() {
  const { theme, setTheme } = useSubs()
  const { summary } = useSubsSummary()
  return (
    <section data-testid="page-dashboard">
      <h1>Dashboard</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <div data-testid="stats">
        <StatCard label="Monthly" value={summary.monthlyTotal} testid="monthly" />
        <StatCard label="Annual" value={summary.annualTotal} testid="annual" />
        <StatCard label="Active" value={summary.activeCount} testid="active" />
        <StatCard label="Due soon" value={summary.dueSoonCount} testid="duesoon" />
      </div>
    </section>
  )
}

'use client'
import { useSplit } from '../../components/SplitProvider'
import { useBalances } from '../../hooks/useBalances'
import StatCard from '../../components/StatCard'

export default function DashboardPage() {
  const { people, expenses, theme, setTheme } = useSplit()
  const { total } = useBalances()
  const perHead = people.length > 0 ? total / people.length : 0
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
        <StatCard label="Total spent" value={total} testid="total" />
        <StatCard label="People" value={people.length} testid="people" />
        <StatCard label="Expenses" value={expenses.length} testid="expenses" />
        <StatCard label="Per person" value={perHead} testid="perhead" />
      </div>
    </section>
  )
}

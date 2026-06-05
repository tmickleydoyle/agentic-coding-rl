'use client'
import { useDividends } from '../../components/DividendsProvider'
import { useDividendsSummary } from '../../hooks/useDividends'
import StatCard from '../../components/StatCard'
import HoldingCard from '../../components/HoldingCard'

export default function DashboardPage() {
  const { holdings, selectHolding, theme, setTheme } = useDividends()
  const { totals } = useDividendsSummary()
  return (
    <section data-testid="page-dashboard">
      <h1>Dividend Dashboard</h1>
      <div data-testid="stats">
        <StatCard label="Annual Income" value={totals.totalIncome} testid="income" />
        <StatCard label="Monthly Avg" value={totals.monthlyAverage} testid="monthly" />
        <StatCard label="Holdings" value={totals.holdingCount} testid="count" />
        <StatCard label="Paying Months" value={totals.payingMonths} testid="months" />
      </div>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      {holdings.length === 0 ? (
        <p data-testid="empty-holdings">No holdings yet.</p>
      ) : (
        <ul data-testid="holding-list">
          {holdings.map((h) => (
            <HoldingCard key={h.id} holding={h} onSelect={selectHolding} />
          ))}
        </ul>
      )}
    </section>
  )
}

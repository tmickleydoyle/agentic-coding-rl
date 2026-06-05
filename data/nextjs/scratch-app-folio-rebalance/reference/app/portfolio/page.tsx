'use client'
import { useRebalance } from '../../components/RebalanceProvider'
import { useRebalanceSummary } from '../../hooks/useRebalance'
import StatCard from '../../components/StatCard'
import HoldingRow from '../../components/HoldingRow'

export default function PortfolioPage() {
  const { holdings, selectHolding, theme, setTheme } = useRebalance()
  const { totals } = useRebalanceSummary()
  return (
    <section data-testid="page-portfolio">
      <h1>Portfolio</h1>
      <div data-testid="stats">
        <StatCard label="Value" value={totals.totalValue} testid="value" />
        <StatCard label="Target %" value={totals.totalTargetPercent} testid="target-total" />
        <StatCard label="Holdings" value={totals.holdingCount} testid="count" />
        <StatCard label="Balanced" value={totals.balanced ? 'yes' : 'no'} testid="balanced" />
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
            <HoldingRow key={h.id} holding={h} holdings={holdings} onSelect={selectHolding} />
          ))}
        </ul>
      )}
    </section>
  )
}

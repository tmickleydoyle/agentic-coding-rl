'use client'
import { usePortfolio } from '../../components/PortfolioProvider'
import { usePortfolioSummary } from '../../hooks/usePortfolio'
import StatCard from '../../components/StatCard'
import HoldingCard from '../../components/HoldingCard'

export default function PortfolioPage() {
  const { holdings, selectHolding, theme, setTheme } = usePortfolio()
  const { totals } = usePortfolioSummary()
  return (
    <section data-testid="page-portfolio">
      <h1>Portfolio</h1>
      <div data-testid="stats">
        <StatCard label="Value" value={totals.totalValue} testid="value" />
        <StatCard label="Cost" value={totals.totalCost} testid="cost" />
        <StatCard label="Gain/Loss" value={totals.totalGainLoss} testid="gainloss" />
        <StatCard label="Gain/Loss %" value={totals.totalGainLossPercent} testid="gainloss-percent" />
        <StatCard label="Holdings" value={totals.holdingCount} testid="count" />
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

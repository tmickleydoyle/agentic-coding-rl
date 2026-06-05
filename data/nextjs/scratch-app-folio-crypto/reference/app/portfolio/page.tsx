'use client'
import { usePortfolio } from '../../components/PortfolioProvider'
import { usePortfolioSummary } from '../../hooks/usePortfolio'
import StatCard from '../../components/StatCard'
import CoinCard from '../../components/CoinCard'

export default function PortfolioPage() {
  const { coins, selectCoin, theme, setTheme } = usePortfolio()
  const { totals } = usePortfolioSummary()
  return (
    <section data-testid="page-portfolio">
      <h1>Portfolio</h1>
      <div data-testid="stats">
        <StatCard label="Value" value={totals.totalValue} testid="value" />
        <StatCard label="24h Change" value={totals.totalChange} testid="change" />
        <StatCard label="24h Change %" value={totals.totalChangePercent} testid="change-percent" />
        <StatCard label="Coins" value={totals.coinCount} testid="count" />
      </div>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      {coins.length === 0 ? (
        <p data-testid="empty-coins">No coins yet.</p>
      ) : (
        <ul data-testid="coin-list">
          {coins.map((c) => (
            <CoinCard key={c.id} coin={c} onSelect={selectCoin} />
          ))}
        </ul>
      )}
    </section>
  )
}

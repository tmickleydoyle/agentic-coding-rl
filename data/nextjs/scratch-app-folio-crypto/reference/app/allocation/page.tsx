'use client'
import { usePortfolio } from '../../components/PortfolioProvider'
import { allocationPercent, coinValue, totalValue } from '../../hooks/usePortfolio'

export default function AllocationPage() {
  const { coins } = usePortfolio()
  const total = totalValue(coins)
  return (
    <section data-testid="page-allocation">
      <h1>Allocation</h1>
      <p data-testid="allocation-total">{total}</p>
      {coins.length === 0 ? (
        <p data-testid="empty-allocation">No coins yet.</p>
      ) : (
        <ul data-testid="allocation-list">
          {coins.map((c) => (
            <li key={c.id} data-testid={`alloc-${c.id}`}>
              <span data-testid={`alloc-${c.id}-symbol`}>{c.symbol}</span>
              <span data-testid={`alloc-${c.id}-value`}>{coinValue(c)}</span>
              <span data-testid={`alloc-${c.id}-percent`}>{allocationPercent(c, coins)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

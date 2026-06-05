'use client'
import { usePortfolio } from '../../components/PortfolioProvider'
import { allocationPercent, marketValue, totalValue } from '../../hooks/usePortfolio'

export default function AllocationPage() {
  const { holdings } = usePortfolio()
  const total = totalValue(holdings)
  return (
    <section data-testid="page-allocation">
      <h1>Allocation</h1>
      <p data-testid="allocation-total">{total}</p>
      {holdings.length === 0 ? (
        <p data-testid="empty-allocation">No holdings yet.</p>
      ) : (
        <ul data-testid="allocation-list">
          {holdings.map((h) => (
            <li key={h.id} data-testid={`alloc-${h.id}`}>
              <span data-testid={`alloc-${h.id}-symbol`}>{h.symbol}</span>
              <span data-testid={`alloc-${h.id}-value`}>{marketValue(h)}</span>
              <span data-testid={`alloc-${h.id}-percent`}>{allocationPercent(h, holdings)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

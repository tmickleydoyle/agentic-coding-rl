'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSeller } from '../../hooks/useSeller'

export default function RevenuePage() {
  const { products } = useApp()
  const { revenue, pending, revenueByProduct } = useSeller()
  return (
    <section data-testid="page-revenue">
      <h1>Revenue</h1>
      <span data-testid="total-revenue">{revenue}</span>
      <span data-testid="pending-count">{pending}</span>
      <ul data-testid="revenue-breakdown">
        {products.map((p) => (
          <li key={p.id} data-testid={`rev-${p.id}`}>
            <span data-testid={`rev-${p.id}-name`}>{p.name}</span>
            <span data-testid={`rev-${p.id}-value`}>{revenueByProduct[p.id] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

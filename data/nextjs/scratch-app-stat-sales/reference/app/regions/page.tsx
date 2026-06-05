'use client'
import { useSales } from '../../hooks/useSales'

export default function RegionsPage() {
  const { byRegion } = useSales()
  return (
    <section data-testid="page-regions">
      <h1>Regions</h1>
      <ul data-testid="region-list">
        {byRegion.map((r) => (
          <li key={r.region} data-testid={`region-${r.region}`}>
            <span data-testid={`region-${r.region}-revenue`}>{r.revenue}</span>
            <span data-testid={`region-${r.region}-units`}>{r.units}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

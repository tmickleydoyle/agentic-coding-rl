'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ConvertedPage() {
  const { leads, deals } = useApp()
  const leadName = (id: string): string => leads.find((l) => l.id === id)?.name ?? 'Unknown'
  const total = deals.reduce((sum, d) => sum + d.value, 0)

  return (
    <section data-testid="page-converted">
      <h1>Converted</h1>
      <span data-testid="converted-count">{deals.length}</span>
      <span data-testid="converted-total">{total}</span>
      <ul data-testid="converted-list">
        {deals.map((d) => (
          <li key={d.id} data-testid={`converted-${d.id}`}>
            <span data-testid={`converted-${d.id}-lead`}>{leadName(d.leadId)}</span>
            <span data-testid={`converted-${d.id}-value`}>{d.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

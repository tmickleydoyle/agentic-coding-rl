'use client'
import { useApp } from '../../components/AppStateProvider'
import { useTrades } from '../../hooks/useTrades'

export default function MyTradesPage() {
  const { items } = useApp()
  const { myOffers } = useTrades()

  const itemName = (id: string): string => items.find((i) => i.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-mytrades">
      <h1>My trades</h1>
      {myOffers.length === 0 ? (
        <p data-testid="no-trades">You have not made any offers.</p>
      ) : (
        <ul data-testid="mytrades-list">
          {myOffers.map((o) => (
            <li key={o.id} data-testid={`mytrade-${o.id}`} data-status={o.status}>
              <span data-testid={`mytrade-${o.id}-item`}>{itemName(o.itemId)}</span>
              <span data-testid={`mytrade-${o.id}-status`}>{o.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

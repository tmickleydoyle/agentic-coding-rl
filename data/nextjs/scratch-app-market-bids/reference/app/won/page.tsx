'use client'
import { useApp } from '../../components/AppStateProvider'
import { wonBy } from '../../hooks/useAuctions'
import { ME } from '../../lib/types'

export default function WonPage() {
  const { auctions } = useApp()
  const won = wonBy(auctions, ME)

  return (
    <section data-testid="page-won">
      <h1>Won items</h1>
      {won.length === 0 ? (
        <p data-testid="no-won">You have not won any auctions.</p>
      ) : (
        <ul data-testid="won-list">
          {won.map((a) => (
            <li key={a.id} data-testid={`won-${a.id}`}>
              <span data-testid={`won-${a.id}-title`}>{a.title}</span>
              <span data-testid={`won-${a.id}-price`}>{a.currentBid}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

'use client'
import { useApp } from '../../components/AppStateProvider'
import { useMyParties } from '../../hooks/useParties'

export default function MyPartiesPage() {
  const { partyStatus } = useApp()
  const mine = useMyParties()

  if (mine.length === 0) {
    return (
      <section data-testid="page-my-parties">
        <p data-testid="no-rsvps">You have not RSVP'd to any parties.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-my-parties">
      <h1>My Parties</h1>
      <span data-testid="rsvp-count-value">{mine.length}</span>
      <ul data-testid="my-parties-list">
        {mine.map((p) => (
          <li key={p.id} data-testid={`mp-${p.id}`}>
            <span data-testid={`mp-${p.id}-title`}>{p.title}</span>
            <span data-testid={`mp-${p.id}-status`}>{partyStatus(p)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

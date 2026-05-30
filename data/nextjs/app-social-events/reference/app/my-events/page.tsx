'use client'
import { useEvents } from '../../components/AppStateProvider'
import { myEvents, rsvpCounts } from '../../hooks/useEventStats'
import { RSVPS } from '../../lib/types'

export default function MyEventsPage() {
  const { events } = useEvents()
  const mine = myEvents(events)
  const counts = rsvpCounts(events)

  return (
    <section data-testid="page-my-events">
      <h1>My events</h1>
      <ul data-testid="rsvp-counts">
        {RSVPS.map((r) => (
          <li key={r} data-testid={`rsvp-count-${r}`}>
            <span data-testid={`rsvp-count-${r}-name`}>{r}</span>
            <span data-testid={`rsvp-count-${r}-value`}>{counts[r]}</span>
          </li>
        ))}
      </ul>
      {mine.length === 0 ? (
        <p data-testid="my-empty">You have not RSVP'd to any events.</p>
      ) : (
        <ul data-testid="my-list">
          {mine.map((e) => (
            <li key={e.id} data-testid={`my-${e.id}`}>
              <span data-testid={`my-${e.id}-title`}>{e.title}</span>
              <span data-testid={`my-${e.id}-rsvp`}>{e.rsvp}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

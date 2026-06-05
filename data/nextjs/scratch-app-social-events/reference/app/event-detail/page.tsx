'use client'
import { useEvents } from '../../components/AppStateProvider'
import { attendeeCount } from '../../hooks/useEventStats'
import { RSVPS } from '../../lib/types'

export default function EventDetailPage() {
  const { events, selectedId, setRsvp } = useEvents()

  if (!selectedId) {
    return (
      <section data-testid="page-event-detail">
        <p data-testid="no-selection">Select an event to see its detail.</p>
      </section>
    )
  }

  const event = events.find((e) => e.id === selectedId)
  if (!event) {
    return (
      <section data-testid="page-event-detail">
        <p data-testid="no-selection">Event not found.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-event-detail">
      <h2 data-testid="detail-title">{event.title}</h2>
      <p data-testid="detail-count">{attendeeCount(event)}</p>
      <p data-testid="detail-rsvp">{event.rsvp ?? 'none'}</p>
      <div data-testid="rsvp-controls">
        {RSVPS.map((r) => (
          <button key={r} data-testid={`rsvp-${r}`} onClick={() => setRsvp(event.id, r)}>
            {r}
          </button>
        ))}
      </div>
    </section>
  )
}

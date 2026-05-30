'use client'
import { useApp } from '../../components/AppStateProvider'

export default function EventDetailPage() {
  const { events, selectedEventId, remaining, isSoldOut, navigate } = useApp()
  const event = events.find((e) => e.id === selectedEventId)

  if (!event) {
    return (
      <section data-testid="page-event-detail">
        <h1>Event</h1>
        <p data-testid="no-event">No event selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-event-detail">
      <h1 data-testid="event-name">{event.name}</h1>
      <ul data-testid="tiers-list">
        {event.tiers.map((t) => {
          const out = isSoldOut(event.id, t.id)
          return (
            <li key={t.id} data-testid={`tier-${t.id}`}>
              <span data-testid={`tier-${t.id}-name`}>{t.name}</span>
              <span data-testid={`tier-${t.id}-price`}>{t.price}</span>
              <span data-testid={`tier-${t.id}-remaining`}>{remaining(event.id, t.id)}</span>
              {out ? (
                <span data-testid={`tier-${t.id}-soldout`}>Sold out</span>
              ) : (
                <button data-testid={`buy-${t.id}`} onClick={() => navigate('checkout')}>
                  Buy
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

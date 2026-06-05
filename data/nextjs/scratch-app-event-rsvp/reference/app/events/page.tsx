'use client'
import { useApp } from '../../components/AppStateProvider'
import EventCard from '../../components/EventCard'
import { useResponses } from '../../hooks/useResponses'

export default function EventsPage() {
  const { events, headcount, selectEvent } = useApp()
  const { totalHeadcount } = useResponses()
  return (
    <section data-testid="page-events">
      <h1>Events</h1>
      <span data-testid="total-headcount">{totalHeadcount}</span>
      <ul data-testid="events-list">
        {events.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            headcount={headcount(e.id)}
            onView={selectEvent}
          />
        ))}
      </ul>
    </section>
  )
}

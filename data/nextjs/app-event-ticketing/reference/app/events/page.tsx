'use client'
import { useApp } from '../../components/AppStateProvider'
import EventCard from '../../components/EventCard'

export default function EventsPage() {
  const { events, selectEvent } = useApp()
  return (
    <section data-testid="page-events">
      <h1>Events</h1>
      <ul data-testid="events-list">
        {events.map((e) => (
          <EventCard key={e.id} event={e} onView={selectEvent} />
        ))}
      </ul>
    </section>
  )
}

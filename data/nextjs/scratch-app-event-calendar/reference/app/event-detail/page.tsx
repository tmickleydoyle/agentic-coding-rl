'use client'
import { useApp } from '../../components/AppStateProvider'
import EventRow from '../../components/EventRow'

export default function EventDetailPage() {
  const { selectedDay, eventsOn } = useApp()

  if (selectedDay === null) {
    return (
      <section data-testid="page-event-detail">
        <h1>Day</h1>
        <p data-testid="no-day">No day selected.</p>
      </section>
    )
  }

  const events = eventsOn(selectedDay)

  return (
    <section data-testid="page-event-detail">
      <h1 data-testid="day-heading">Day {selectedDay}</h1>
      {events.length === 0 ? (
        <p data-testid="no-events">No events on this day.</p>
      ) : (
        <ul data-testid="day-events">
          {events.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </ul>
      )}
    </section>
  )
}

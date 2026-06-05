'use client'
import { useEvents } from '../../components/AppStateProvider'
import { useEventStats } from '../../hooks/useEventStats'
import Filters from '../../components/Filters'
import EventCard from '../../components/EventCard'

export default function EventsPage() {
  const { theme, setTheme, timeFilter, setTimeFilter, selectEvent } = useEvents()
  const { filtered } = useEventStats()

  return (
    <section data-testid="page-events">
      <h1>Events</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <Filters timeFilter={timeFilter} onTimeChange={setTimeFilter} />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No events match this filter.</p>
      ) : (
        <ul data-testid="event-list">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} onView={selectEvent} />
          ))}
        </ul>
      )}
    </section>
  )
}

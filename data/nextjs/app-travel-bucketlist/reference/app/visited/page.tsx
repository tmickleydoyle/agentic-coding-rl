'use client'
import { useApp } from '../../components/AppStateProvider'
import { useDestinations } from '../../hooks/useDestinations'
import DestinationCard from '../../components/DestinationCard'

export default function VisitedPage() {
  const { destinations, theme, setTheme, selectDestination, toggleVisited } = useApp()
  const { visited, remaining } = useDestinations()
  const visitedItems = destinations.filter((d) => d.visited)
  return (
    <section data-testid="page-visited">
      <h1>Visited</h1>
      <div data-testid="visited-counts">
        <span data-testid="visited-count">{visited}</span>
        <span data-testid="remaining-count">{remaining}</span>
      </div>
      {visitedItems.length === 0 ? (
        <p data-testid="empty-state">No visited destinations yet.</p>
      ) : (
        <ul data-testid="visited-list">
          {visitedItems.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              onOpen={selectDestination}
              onToggle={toggleVisited}
            />
          ))}
        </ul>
      )}
      <div data-testid="theme-section">
        <p data-testid="current-theme">{theme}</p>
        <button data-testid="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    </section>
  )
}

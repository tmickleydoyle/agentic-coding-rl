'use client'
import { useApp } from '../../components/AppStateProvider'

export default function DestinationDetailPage() {
  const { destinations, selectedId, toggleVisited } = useApp()
  const destination = destinations.find((d) => d.id === selectedId) ?? null
  if (!destination) {
    return (
      <section data-testid="page-destination-detail">
        <p data-testid="no-selection">No destination selected.</p>
      </section>
    )
  }
  return (
    <section data-testid="page-destination-detail">
      <h1 data-testid="detail-name">{destination.name}</h1>
      <p data-testid="detail-country">{destination.country}</p>
      <p data-testid="detail-continent">{destination.continent}</p>
      <p data-testid="detail-notes">{destination.notes}</p>
      <p data-testid="detail-visited">{destination.visited ? 'visited' : 'not visited'}</p>
      <button data-testid="detail-toggle" onClick={() => toggleVisited(destination.id)}>
        {destination.visited ? 'Mark unvisited' : 'Mark visited'}
      </button>
    </section>
  )
}

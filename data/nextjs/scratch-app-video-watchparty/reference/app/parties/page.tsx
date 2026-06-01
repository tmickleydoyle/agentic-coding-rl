'use client'
import { useApp } from '../../components/AppStateProvider'
import { filterParties } from '../../hooks/useParties'
import PartyRow from '../../components/PartyRow'

export default function PartiesPage() {
  const { parties, filter, partyStatus, openParty, setFilter } = useApp()
  const visible = filterParties(parties, filter)

  return (
    <section data-testid="page-parties">
      <h1>Parties</h1>
      <div data-testid="filter-bar">
        <button
          data-testid="filter-upcoming"
          aria-pressed={filter === 'upcoming'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          data-testid="filter-past"
          aria-pressed={filter === 'past'}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
        <span data-testid="current-filter">{filter}</span>
      </div>
      {visible.length === 0 ? (
        <p data-testid="no-parties">No parties.</p>
      ) : (
        <ul data-testid="parties-list">
          {visible.map((p) => (
            <PartyRow key={p.id} party={p} status={partyStatus(p)} onOpen={openParty} />
          ))}
        </ul>
      )}
    </section>
  )
}

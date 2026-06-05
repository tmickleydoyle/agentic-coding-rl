'use client'
import { useApp } from '../../components/AppStateProvider'
import { useDestinations } from '../../hooks/useDestinations'
import DestinationCard from '../../components/DestinationCard'

export default function ListPage() {
  const { continentFilter, setContinentFilter, selectDestination, toggleVisited } = useApp()
  const { filtered, groups, allContinents, visited, remaining } = useDestinations()
  return (
    <section data-testid="page-list">
      <h1>Bucket list</h1>
      <div data-testid="counts">
        <span data-testid="count-total">{filtered.length}</span>
        <span data-testid="count-visited">{visited}</span>
        <span data-testid="count-remaining">{remaining}</span>
      </div>
      <select
        data-testid="continent-filter"
        value={continentFilter}
        onChange={(e) => setContinentFilter(e.target.value)}
      >
        <option value="all">All continents</option>
        {allContinents.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No destinations match.</p>
      ) : (
        <div data-testid="continent-groups">
          {groups.map((g) => (
            <div key={g.continent} data-testid={`group-${g.continent}`}>
              <h2 data-testid={`group-${g.continent}-title`}>{g.continent}</h2>
              <span data-testid={`group-${g.continent}-count`}>{g.items.length}</span>
              <ul data-testid={`group-${g.continent}-list`}>
                {g.items.map((d) => (
                  <DestinationCard
                    key={d.id}
                    destination={d}
                    onOpen={selectDestination}
                    onToggle={toggleVisited}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

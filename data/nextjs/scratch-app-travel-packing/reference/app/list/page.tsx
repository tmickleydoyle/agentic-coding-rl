'use client'
import { usePacking } from '../../components/PackingProvider'
import { useTripList } from '../../hooks/usePackingStats'
import ItemRow from '../../components/ItemRow'

export default function ListPage() {
  const { selectedTripId, togglePacked, removeItem, navigate } = usePacking()
  const { trip, groups, percent } = useTripList(selectedTripId)

  if (!trip) {
    return (
      <section data-testid="page-list">
        <p data-testid="no-trip">No trip selected.</p>
        <button data-testid="back-to-trips" onClick={() => navigate('trips')}>
          Back
        </button>
      </section>
    )
  }

  return (
    <section data-testid="page-list">
      <h1 data-testid="list-name">{trip.name}</h1>
      <p data-testid="list-percent">{percent}</p>
      {groups.length === 0 ? (
        <p data-testid="list-empty">No items yet.</p>
      ) : (
        groups.map((g) => (
          <div key={g.category} data-testid={`category-${g.category}`}>
            <h2 data-testid={`category-${g.category}-label`}>{g.category}</h2>
            <span data-testid={`category-${g.category}-count`}>
              {g.packed}/{g.total}
            </span>
            <ul data-testid={`category-${g.category}-list`}>
              {g.items.map((it) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  onToggle={togglePacked}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          </div>
        ))
      )}
      <button data-testid="add-item-link" onClick={() => navigate('add-item')}>
        Add item
      </button>
    </section>
  )
}

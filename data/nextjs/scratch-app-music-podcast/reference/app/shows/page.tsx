'use client'
import { useApp } from '../../components/AppStateProvider'
import { useShows } from '../../hooks/useShows'

export default function ShowsPage() {
  const { categoryFilter, setCategoryFilter, toggleSubscribe, openShow } = useApp()
  const { visibleShows, categories } = useShows()

  return (
    <section data-testid="page-shows">
      <h1>Shows</h1>
      <select
        data-testid="category-filter"
        value={categoryFilter ?? 'all'}
        onChange={(e) => setCategoryFilter(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {visibleShows.length === 0 ? (
        <p data-testid="shows-empty">No shows match.</p>
      ) : (
        <ul data-testid="show-list">
          {visibleShows.map((s) => (
            <li key={s.id} data-testid={`show-${s.id}`}>
              <span data-testid={`show-${s.id}-title`}>{s.title}</span>
              <span data-testid={`show-${s.id}-category`}>{s.category}</span>
              <button data-testid={`subscribe-${s.id}`} onClick={() => toggleSubscribe(s.id)}>
                {s.subscribed ? 'Unsubscribe' : 'Subscribe'}
              </button>
              <button data-testid={`open-${s.id}`} onClick={() => openShow(s.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

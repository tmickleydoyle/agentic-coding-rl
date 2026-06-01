'use client'
import { useApp } from '../../components/AppStateProvider'
import { useInbox } from '../../hooks/useInbox'
import PersonRow from '../../components/PersonRow'

export default function PeoplePage() {
  const { query, setQuery } = useApp()
  const { matchedPeople } = useInbox()

  return (
    <section data-testid="page-people">
      <h1>People</h1>
      <label htmlFor="people-search">Search</label>
      <input
        id="people-search"
        data-testid="people-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {matchedPeople.length === 0 ? (
        <p data-testid="no-people">No people found.</p>
      ) : (
        <ul data-testid="people-list">
          {matchedPeople.map((p) => (
            <PersonRow key={p.id} person={p} />
          ))}
        </ul>
      )}
    </section>
  )
}

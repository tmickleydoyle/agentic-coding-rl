'use client'
import { useApp } from '../../components/AppStateProvider'
import { useGigs } from '../../hooks/useGigs'
import Filters from '../../components/Filters'
import GigCard from '../../components/GigCard'

export default function GigsPage() {
  const { categoryFilter, setCategoryFilter, select } = useApp()
  const { filtered } = useGigs()

  return (
    <section data-testid="page-gigs">
      <h1>Gigs</h1>
      <Filters categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No gigs match this filter.</p>
      ) : (
        <ul data-testid="gig-list">
          {filtered.map((g) => (
            <GigCard key={g.id} gig={g} onView={select} />
          ))}
        </ul>
      )}
    </section>
  )
}

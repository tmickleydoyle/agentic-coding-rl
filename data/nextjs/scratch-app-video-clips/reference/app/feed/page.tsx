'use client'
import { useApp } from '../../components/AppStateProvider'
import { filterByCategory } from '../../hooks/useClips'
import ClipCard from '../../components/ClipCard'

export default function FeedPage() {
  const { clips, activeCategory, isSaved, likesFor, openClip, setCategory } = useApp()
  const visible = filterByCategory(clips, activeCategory)

  return (
    <section data-testid="page-feed">
      <h1>Feed</h1>
      <span data-testid="active-category">{activeCategory ?? 'All'}</span>
      <button data-testid="all-filter" onClick={() => setCategory(null)}>
        All
      </button>
      {visible.length === 0 ? (
        <p data-testid="no-clips">No clips.</p>
      ) : (
        <ul data-testid="clip-list">
          {visible.map((c) => (
            <ClipCard
              key={c.id}
              clip={c}
              likes={likesFor(c.id)}
              saved={isSaved(c.id)}
              onOpen={openClip}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

'use client'
import { useBoard } from '../../components/BoardProvider'

export default function ArchivePage() {
  const { cards, restoreCard } = useBoard()
  const archived = cards.filter((c) => c.archived)
  return (
    <section data-testid="page-archive">
      <h1>Archive</h1>
      {archived.length === 0 ? (
        <p data-testid="empty-archive">No archived cards.</p>
      ) : (
        <ul data-testid="archive-list">
          {archived.map((c) => (
            <li key={c.id} data-testid={`archived-${c.id}`}>
              <span data-testid={`archived-${c.id}-title`}>{c.title}</span>
              <button data-testid={`restore-${c.id}`} onClick={() => restoreCard(c.id)}>
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

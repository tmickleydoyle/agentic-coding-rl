'use client'
import { useApp } from '../../components/AppStateProvider'
import { useShows } from '../../hooks/useShows'

export default function QueuePage() {
  const { dequeue } = useApp()
  const { queueEpisodes, totalQueueMinutes } = useShows()

  return (
    <section data-testid="page-queue">
      <h1>Queue</h1>
      <p data-testid="queue-minutes">{totalQueueMinutes}</p>
      {queueEpisodes.length === 0 ? (
        <p data-testid="queue-empty">Up-next is empty.</p>
      ) : (
        <ol data-testid="queue-list">
          {queueEpisodes.map((e) => (
            <li key={e.id} data-testid={`q-ep-${e.id}`}>
              <span data-testid={`q-ep-${e.id}-title`}>{e.title}</span>
              <button data-testid={`remove-q-${e.id}`} onClick={() => dequeue(e.id)}>
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

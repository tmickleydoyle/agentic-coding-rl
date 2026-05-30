'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLibrary } from '../../hooks/useLibrary'

export default function QueuePage() {
  const { shuffle, toggleShuffle, dequeue } = useApp()
  const { queueSongs, totalQueueDuration } = useLibrary()

  return (
    <section data-testid="page-queue">
      <h1>Queue</h1>
      <button data-testid="shuffle-toggle" onClick={() => toggleShuffle()}>
        {shuffle ? 'Shuffle: On' : 'Shuffle: Off'}
      </button>
      <p data-testid="queue-duration">{totalQueueDuration}</p>
      {queueSongs.length === 0 ? (
        <p data-testid="queue-empty">Queue is empty.</p>
      ) : (
        <ol data-testid="queue-list">
          {queueSongs.map((s) => (
            <li key={s.id} data-testid={`q-song-${s.id}`}>
              <span data-testid={`q-song-${s.id}-title`}>{s.title}</span>
              <button data-testid={`remove-q-${s.id}`} onClick={() => dequeue(s.id)}>
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

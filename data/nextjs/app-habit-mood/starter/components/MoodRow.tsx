'use client'
import type { MoodEntry } from '../lib/types'

export default function MoodRow({
  entry,
  onRemove,
}: {
  entry: MoodEntry
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`entry-${entry.id}`} data-score={entry.score}>
      <span data-testid={`entry-${entry.id}-date`}>{entry.date}</span>
      <span data-testid={`entry-${entry.id}-score`}>{entry.score}</span>
      <span data-testid={`entry-${entry.id}-triggers`}>{entry.triggers.join(', ')}</span>
      <button data-testid={`remove-${entry.id}`} onClick={() => onRemove(entry.id)}>
        Delete
      </button>
    </li>
  )
}

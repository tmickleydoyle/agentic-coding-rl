'use client'
import type { StepEntry } from '../lib/types'

export default function EntryRow({
  entry,
  goal,
  onRemove,
}: {
  entry: StepEntry
  goal: number
  onRemove: (id: string) => void
}) {
  const met = entry.steps >= goal
  return (
    <li data-testid={`entry-${entry.id}`} data-met={met ? 'true' : 'false'}>
      <span data-testid={`entry-${entry.id}-date`}>{entry.date}</span>
      <span data-testid={`entry-${entry.id}-steps`}>{entry.steps}</span>
      <button data-testid={`remove-${entry.id}`} onClick={() => onRemove(entry.id)}>
        Delete
      </button>
    </li>
  )
}

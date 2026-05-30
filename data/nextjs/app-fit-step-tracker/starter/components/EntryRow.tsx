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
  // TODO: render date/steps, data-met flag, and a remove-<id> button.
  void goal
  void onRemove
  return <li data-testid={`entry-${entry.id}`} data-met="false" />
}

'use client'
import type { Objective } from '../lib/types'

export default function ObjectiveRow({
  objective,
  progress,
  onOpen,
}: {
  objective: Objective
  progress: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`objective-${objective.id}`}>
      <span data-testid={`objective-${objective.id}-title`}>{objective.title}</span>
      <span data-testid={`objective-${objective.id}-owner`}>{objective.owner}</span>
      <span data-testid={`objective-${objective.id}-progress`}>{progress}</span>
      <button data-testid={`open-${objective.id}`} onClick={() => onOpen(objective.id)}>
        Open
      </button>
    </li>
  )
}

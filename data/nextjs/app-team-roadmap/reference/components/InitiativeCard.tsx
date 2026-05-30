'use client'
import type { Initiative } from '../lib/types'

export default function InitiativeCard({
  initiative,
  onOpen,
}: {
  initiative: Initiative
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`card-${initiative.id}`} data-status={initiative.status}>
      <span data-testid={`card-${initiative.id}-title`}>{initiative.title}</span>
      <button data-testid={`open-${initiative.id}`} onClick={() => onOpen(initiative.id)}>
        Open
      </button>
    </li>
  )
}

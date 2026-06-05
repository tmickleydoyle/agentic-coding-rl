'use client'
import type { Card } from '../lib/types'

export default function CardItem({
  card,
  onForward,
  onBack,
  onArchive,
  onDelete,
}: {
  card: Card
  onForward: (id: string) => void
  onBack: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}) {
  const canForward = card.column !== 'done'
  const canBack = card.column !== 'backlog'
  return (
    <li data-testid={`card-${card.id}`} data-column={card.column}>
      <span data-testid={`card-${card.id}-title`}>{card.title}</span>
      {canBack ? (
        <button data-testid={`back-${card.id}`} onClick={() => onBack(card.id)}>
          Back
        </button>
      ) : null}
      {canForward ? (
        <button data-testid={`forward-${card.id}`} onClick={() => onForward(card.id)}>
          Forward
        </button>
      ) : null}
      <button data-testid={`archive-${card.id}`} onClick={() => onArchive(card.id)}>
        Archive
      </button>
      <button data-testid={`delete-${card.id}`} onClick={() => onDelete(card.id)}>
        Delete
      </button>
    </li>
  )
}

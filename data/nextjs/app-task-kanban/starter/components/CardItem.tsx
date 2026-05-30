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
  // TODO: render <li data-testid="card-<id>" data-column> with the title, a forward-<id>
  // button (not in done), a back-<id> button (not in backlog), archive-<id> and delete-<id>.
  void onForward
  void onBack
  void onArchive
  void onDelete
  return <li data-testid={`card-${card.id}`} />
}

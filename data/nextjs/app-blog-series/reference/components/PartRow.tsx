'use client'
import type { Part } from '../lib/types'

export default function PartRow({
  part,
  onToggle,
  onOpenReader,
}: {
  part: Part
  onToggle: (id: string) => void
  onOpenReader: (id: string) => void
}) {
  return (
    <li data-testid={`part-${part.id}`} data-read={part.read ? 'true' : 'false'}>
      <span data-testid={`part-${part.id}-order`}>{part.order}</span>
      <span data-testid={`part-${part.id}-title`}>{part.title}</span>
      <button data-testid={`read-${part.id}`} onClick={() => onToggle(part.id)}>
        {part.read ? 'Mark unread' : 'Mark read'}
      </button>
      <button data-testid={`open-reader-${part.id}`} onClick={() => onOpenReader(part.id)}>
        Read
      </button>
    </li>
  )
}

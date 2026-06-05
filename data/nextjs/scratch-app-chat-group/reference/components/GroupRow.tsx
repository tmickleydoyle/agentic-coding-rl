'use client'
import type { Group } from '../lib/types'

export default function GroupRow({
  group,
  onOpen,
}: {
  group: Group
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`group-${group.id}`}>
      <span data-testid={`group-${group.id}-name`}>{group.name}</span>
      <span data-testid={`group-${group.id}-count`}>{group.memberIds.length}</span>
      <button data-testid={`open-${group.id}`} onClick={() => onOpen(group.id)}>
        Open
      </button>
    </li>
  )
}

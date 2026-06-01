'use client'
import type { Thread } from '../lib/types'

export default function ThreadRow({
  thread,
  personName,
  onOpen,
}: {
  thread: Thread
  personName: string
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`thread-${thread.id}`}>
      <span data-testid={`thread-${thread.id}-name`}>{personName}</span>
      <span data-testid={`thread-${thread.id}-unread`}>{thread.unread ? 'Unread' : 'Read'}</span>
      <button data-testid={`open-${thread.id}`} onClick={() => onOpen(thread.id)}>
        Open
      </button>
    </li>
  )
}

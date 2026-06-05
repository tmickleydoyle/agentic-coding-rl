'use client'
import type { Thread } from '../lib/types'

export default function ThreadRow({
  thread,
  onUpvote,
  onOpen,
}: {
  thread: Thread
  onUpvote: (id: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`thread-${thread.id}`}>
      <span data-testid={`thread-${thread.id}-title`}>{thread.title}</span>
      <span data-testid={`thread-${thread.id}-votes`}>{thread.votes}</span>
      <button data-testid={`upvote-${thread.id}`} onClick={() => onUpvote(thread.id)}>
        Upvote
      </button>
      <button data-testid={`open-${thread.id}`} onClick={() => onOpen(thread.id)}>
        Open
      </button>
    </li>
  )
}

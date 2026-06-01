'use client'
import type { Message } from '../lib/types'

export default function MessageCard({
  message,
  authorHandle,
  replyCount,
  onOpen,
}: {
  message: Message
  authorHandle: string
  replyCount: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`message-${message.id}`}>
      <span data-testid={`message-${message.id}-author`}>{authorHandle}</span>
      <span data-testid={`message-${message.id}-text`}>{message.text}</span>
      <span data-testid={`message-${message.id}-replies`}>{replyCount}</span>
      <span data-testid={`message-${message.id}-status`}>
        {message.resolved ? 'Resolved' : 'Open'}
      </span>
      <button data-testid={`open-${message.id}`} onClick={() => onOpen(message.id)}>
        Open
      </button>
    </li>
  )
}

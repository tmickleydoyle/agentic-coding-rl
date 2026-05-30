'use client'
import type { Message } from '../lib/types'

export default function MessageItem({
  message,
  authorHandle,
}: {
  message: Message
  authorHandle: string
}) {
  return (
    <li data-testid={`message-${message.id}`}>
      <span data-testid={`message-${message.id}-author`}>{authorHandle}</span>
      <span data-testid={`message-${message.id}-text`}>{message.text}</span>
    </li>
  )
}

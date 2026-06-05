'use client'
import type { Message } from '../lib/types'

export default function ResultRow({
  message,
  onOpen,
}: {
  message: Message
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`result-${message.id}`}>
      <span data-testid={`result-${message.id}-text`}>{message.text}</span>
      <button data-testid={`open-result-${message.id}`} onClick={() => onOpen(message.id)}>
        Open
      </button>
    </li>
  )
}

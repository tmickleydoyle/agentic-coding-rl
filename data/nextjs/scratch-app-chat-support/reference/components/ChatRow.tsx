'use client'
import type { Chat } from '../lib/types'

export default function ChatRow({
  chat,
  onOpen,
}: {
  chat: Chat
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`chat-${chat.id}`}>
      <span data-testid={`chat-${chat.id}-customer`}>{chat.customer}</span>
      <span data-testid={`chat-${chat.id}-status`}>{chat.status}</span>
      <button data-testid={`open-${chat.id}`} onClick={() => onOpen(chat.id)}>
        Open
      </button>
    </li>
  )
}

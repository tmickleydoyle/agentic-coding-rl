'use client'
import type { Chat } from '../lib/types'

export default function ChatRow({
  chat,
  onOpen,
}: {
  chat: Chat
  onOpen: (id: string) => void
}) {
  // TODO: render the chat row with customer, status, and an open- button.
  void onOpen
  return <li data-testid={`chat-${chat.id}`} />
}

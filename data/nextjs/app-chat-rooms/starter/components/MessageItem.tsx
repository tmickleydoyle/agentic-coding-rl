'use client'
import type { Message } from '../lib/types'

export default function MessageItem({
  message,
  authorHandle,
}: {
  message: Message
  authorHandle: string
}) {
  // TODO: render the message row with author handle and text.
  void authorHandle
  return <li data-testid={`message-${message.id}`} />
}

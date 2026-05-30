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
  // TODO: render the message row with author/text/reply-count/status and an open- button.
  void authorHandle
  void replyCount
  void onOpen
  return <li data-testid={`message-${message.id}`} />
}

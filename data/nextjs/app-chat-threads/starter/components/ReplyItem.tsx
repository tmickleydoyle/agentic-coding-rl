'use client'
import type { Reply } from '../lib/types'

export default function ReplyItem({
  reply,
  authorHandle,
}: {
  reply: Reply
  authorHandle: string
}) {
  // TODO: render the reply row with author handle and text.
  void authorHandle
  return <li data-testid={`reply-${reply.id}`} />
}

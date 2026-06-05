'use client'
import type { Reply } from '../lib/types'

export default function ReplyItem({
  reply,
  authorHandle,
}: {
  reply: Reply
  authorHandle: string
}) {
  return (
    <li data-testid={`reply-${reply.id}`}>
      <span data-testid={`reply-${reply.id}-author`}>{authorHandle}</span>
      <span data-testid={`reply-${reply.id}-text`}>{reply.text}</span>
    </li>
  )
}

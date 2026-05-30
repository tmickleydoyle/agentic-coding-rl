'use client'
import type { Reply } from '../lib/types'

export default function ReplyItem({ reply }: { reply: Reply }) {
  return (
    <li data-testid={`reply-${reply.id}`}>
      <span data-testid={`reply-${reply.id}-text`}>{reply.text}</span>
    </li>
  )
}

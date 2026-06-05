'use client'
import type { Reply } from '../lib/types'

export default function ReplyItem({
  reply,
  onUpvote,
}: {
  reply: Reply
  onUpvote: (id: string) => void
}) {
  return (
    <li data-testid={`reply-${reply.id}`}>
      <span data-testid={`reply-${reply.id}-text`}>{reply.text}</span>
      <span data-testid={`reply-${reply.id}-votes`}>{reply.votes}</span>
      <button data-testid={`upvote-reply-${reply.id}`} onClick={() => onUpvote(reply.id)}>
        Upvote
      </button>
    </li>
  )
}

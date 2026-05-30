'use client'
import type { Reply } from '../lib/types'

export default function ReplyItem({
  reply,
  onUpvote,
}: {
  reply: Reply
  onUpvote: (id: string) => void
}) {
  // TODO: render reply text/votes and an upvote-reply-<id> button.
  void onUpvote
  return <li data-testid={`reply-${reply.id}`} />
}

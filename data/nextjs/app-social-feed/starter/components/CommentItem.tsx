'use client'
import type { Comment } from '../lib/types'

export default function CommentItem({
  comment,
  authorHandle,
}: {
  comment: Comment
  authorHandle: string
}) {
  // TODO: render the comment text (and author handle).
  void authorHandle
  return <li data-testid={`comment-${comment.id}`} />
}

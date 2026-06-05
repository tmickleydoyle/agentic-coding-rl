'use client'
import type { Comment } from '../lib/types'

export default function CommentItem({
  comment,
  authorHandle,
}: {
  comment: Comment
  authorHandle: string
}) {
  return (
    <li data-testid={`comment-${comment.id}`}>
      <span data-testid={`comment-${comment.id}-author`}>{authorHandle}</span>
      <span data-testid={`comment-${comment.id}-text`}>{comment.text}</span>
    </li>
  )
}

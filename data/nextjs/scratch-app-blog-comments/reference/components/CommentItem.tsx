'use client'
import type { Comment, CommentStatus } from '../lib/types'

export default function CommentItem({
  comment,
  onSetStatus,
  onRemove,
}: {
  comment: Comment
  onSetStatus: (id: string, status: CommentStatus) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`comment-${comment.id}`} data-status={comment.status}>
      <span data-testid={`comment-${comment.id}-author`}>{comment.author}</span>
      <span data-testid={`comment-${comment.id}-body`}>{comment.body}</span>
      <span data-testid={`comment-${comment.id}-status`}>{comment.status}</span>
      <button
        data-testid={`approve-${comment.id}`}
        onClick={() => onSetStatus(comment.id, 'approved')}
      >
        Approve
      </button>
      <button
        data-testid={`spam-${comment.id}`}
        onClick={() => onSetStatus(comment.id, 'spam')}
      >
        Spam
      </button>
      <button
        data-testid={`pending-${comment.id}`}
        onClick={() => onSetStatus(comment.id, 'pending')}
      >
        Reset
      </button>
      <button data-testid={`remove-${comment.id}`} onClick={() => onRemove(comment.id)}>
        Delete
      </button>
    </li>
  )
}

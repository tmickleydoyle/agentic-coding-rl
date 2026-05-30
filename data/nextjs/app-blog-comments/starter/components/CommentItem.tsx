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
  // TODO: render <li data-testid="comment-<id>" data-status> with author/body/status and
  // approve-<id>, spam-<id>, pending-<id>, remove-<id> buttons wired to the callbacks.
  void onSetStatus
  void onRemove
  return <li data-testid={`comment-${comment.id}`} />
}

'use client'
import type { Post } from '../lib/types'

export default function PostItem({
  post,
  categoryName,
  onTogglePublish,
  onRemove,
}: {
  post: Post
  categoryName: string
  onTogglePublish: (id: string) => void
  onRemove: (id: string) => void
}) {
  // TODO: render <li data-testid="post-<id>" data-status> with title, categoryName,
  // status, a publish-<id> toggle button and a remove-<id> button.
  void categoryName
  void onTogglePublish
  void onRemove
  return <li data-testid={`post-${post.id}`} />
}

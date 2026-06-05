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
  return (
    <li data-testid={`post-${post.id}`} data-status={post.status}>
      <span data-testid={`post-${post.id}-title`}>{post.title}</span>
      <span data-testid={`post-${post.id}-category`}>{categoryName}</span>
      <span data-testid={`post-${post.id}-status`}>{post.status}</span>
      <button data-testid={`publish-${post.id}`} onClick={() => onTogglePublish(post.id)}>
        {post.status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
      <button data-testid={`remove-${post.id}`} onClick={() => onRemove(post.id)}>
        Delete
      </button>
    </li>
  )
}

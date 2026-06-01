'use client'
import type { Post } from '../lib/types'

export default function PostCard({
  post,
  authorHandle,
  onLike,
  onOpen,
  onAuthor,
}: {
  post: Post
  authorHandle: string
  onLike: (id: string) => void
  onOpen: (id: string) => void
  onAuthor: (authorId: string) => void
}) {
  return (
    <li data-testid={`post-${post.id}`}>
      <button data-testid={`author-${post.id}`} onClick={() => onAuthor(post.authorId)}>
        <span data-testid={`post-${post.id}-author`}>{authorHandle}</span>
      </button>
      <span data-testid={`post-${post.id}-text`}>{post.text}</span>
      <span data-testid={`post-${post.id}-likes`}>{post.likes}</span>
      <button data-testid={`like-${post.id}`} onClick={() => onLike(post.id)}>
        {post.likedByMe ? 'Unlike' : 'Like'}
      </button>
      <button data-testid={`open-${post.id}`} onClick={() => onOpen(post.id)}>
        Open
      </button>
    </li>
  )
}

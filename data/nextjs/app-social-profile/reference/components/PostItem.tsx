'use client'
import type { Post } from '../lib/types'

export default function PostItem({ post }: { post: Post }) {
  return (
    <li data-testid={`post-${post.id}`}>
      <span data-testid={`post-${post.id}-text`}>{post.text}</span>
    </li>
  )
}

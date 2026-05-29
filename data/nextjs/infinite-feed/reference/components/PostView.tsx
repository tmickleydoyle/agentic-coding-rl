'use client'
import type { Post } from './types'

export default function PostView({ post }: { post: Post }) {
  return <li data-testid={`post-${post.id}`}>{post.title}</li>
}

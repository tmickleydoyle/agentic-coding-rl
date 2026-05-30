'use client'
import type { Post } from '../lib/types'

export default function PostItem({ post }: { post: Post }) {
  // TODO: render the post text with post-<id>-text testid
  return <li data-testid={`post-${post.id}`} />
}

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
  // TODO: render the post row with author/text/likes, like-/open-/author- buttons.
  void authorHandle
  void onLike
  void onOpen
  void onAuthor
  return <li data-testid={`post-${post.id}`} />
}

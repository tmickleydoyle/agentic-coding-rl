'use client'
import { useApp } from '../components/AppStateProvider'
import type { Comment, Post } from '../lib/types'

export type CommentCounts = {
  total: number
  pending: number
  approved: number
  spam: number
  byPost: Record<string, number>
}

export function countComments(comments: Comment[], posts: Post[]): CommentCounts {
  const byPost: Record<string, number> = {}
  posts.forEach((p) => {
    byPost[p.id] = 0
  })
  let pending = 0
  let approved = 0
  let spam = 0
  comments.forEach((c) => {
    if (c.status === 'pending') pending += 1
    else if (c.status === 'approved') approved += 1
    else if (c.status === 'spam') spam += 1
    byPost[c.postId] = (byPost[c.postId] ?? 0) + 1
  })
  return {
    total: comments.length,
    pending,
    approved,
    spam,
    byPost,
  }
}

export function filterComments(
  comments: Comment[],
  statusFilter: 'all' | 'pending' | 'approved' | 'spam',
): Comment[] {
  return comments.filter((c) => statusFilter === 'all' || c.status === statusFilter)
}

export function useComments() {
  const { comments, posts, statusFilter } = useApp()
  const counts = countComments(comments, posts)
  const filtered = filterComments(comments, statusFilter)
  return { counts, filtered }
}

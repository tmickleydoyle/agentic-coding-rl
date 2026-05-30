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

export function countComments(_comments: Comment[], _posts: Post[]): CommentCounts {
  // TODO: compute total/pending/approved/spam and per-post counts
  return { total: 0, pending: 0, approved: 0, spam: 0, byPost: {} }
}

export function filterComments(
  _comments: Comment[],
  _statusFilter: 'all' | 'pending' | 'approved' | 'spam',
): Comment[] {
  // TODO: apply the status filter
  return []
}

export function useComments() {
  const { comments, posts, statusFilter } = useApp()
  const counts = countComments(comments, posts)
  const filtered = filterComments(comments, statusFilter)
  return { counts, filtered }
}

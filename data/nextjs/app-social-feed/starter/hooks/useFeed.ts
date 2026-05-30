'use client'
import { useApp } from '../components/AppStateProvider'
import type { Post } from '../lib/types'

export type FeedStats = {
  totalPosts: number
  totalLikes: number
  followingCount: number
}

export function filterFeed(
  _posts: Post[],
  _feedFilter: 'all' | 'following',
  _currentUserId: string,
  _following: string[],
): Post[] {
  // TODO: 'all' returns every post; 'following' returns own + followed authors
  return []
}

export function computeStats(_posts: Post[], _following: string[]): FeedStats {
  // TODO: total posts, sum of likes, following count
  return { totalPosts: 0, totalLikes: 0, followingCount: 0 }
}

export function useFeed() {
  const { posts, feedFilter, currentUserId, following } = useApp()
  const visiblePosts = filterFeed(posts, feedFilter, currentUserId, following)
  const stats = computeStats(posts, following)
  return { visiblePosts, stats }
}

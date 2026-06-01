'use client'
import { useApp } from '../components/AppStateProvider'
import type { Post } from '../lib/types'

export type FeedStats = {
  totalPosts: number
  totalLikes: number
  followingCount: number
}

export function filterFeed(
  posts: Post[],
  feedFilter: 'all' | 'following',
  currentUserId: string,
  following: string[],
): Post[] {
  if (feedFilter === 'all') return posts.slice()
  return posts.filter(
    (p) => p.authorId === currentUserId || following.includes(p.authorId),
  )
}

export function computeStats(posts: Post[], following: string[]): FeedStats {
  let totalLikes = 0
  posts.forEach((p) => {
    totalLikes += p.likes
  })
  return {
    totalPosts: posts.length,
    totalLikes,
    followingCount: following.length,
  }
}

export function useFeed() {
  const { posts, feedFilter, currentUserId, following } = useApp()
  const visiblePosts = filterFeed(posts, feedFilter, currentUserId, following)
  const stats = computeStats(posts, following)
  return { visiblePosts, stats }
}

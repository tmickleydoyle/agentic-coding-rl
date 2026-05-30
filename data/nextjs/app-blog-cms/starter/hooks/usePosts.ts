'use client'
import { useApp } from '../components/AppStateProvider'
import type { Category, Post } from '../lib/types'

export type PostCounts = {
  total: number
  published: number
  draft: number
  byCategory: Record<string, number>
}

export function countPosts(_posts: Post[], _categories: Category[]): PostCounts {
  // TODO: compute total/published/draft and per-category counts
  return { total: 0, published: 0, draft: 0, byCategory: {} }
}

export function filterPosts(
  _posts: Post[],
  _statusFilter: 'all' | 'draft' | 'published',
  _categoryFilter: string,
): Post[] {
  // TODO: apply status + category filters
  return []
}

export function usePosts() {
  const { posts, categories, statusFilter, categoryFilter } = useApp()
  const counts = countPosts(posts, categories)
  const filtered = filterPosts(posts, statusFilter, categoryFilter)
  return { counts, filtered }
}

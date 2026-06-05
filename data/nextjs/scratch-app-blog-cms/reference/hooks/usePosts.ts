'use client'
import { useApp } from '../components/AppStateProvider'
import type { Category, Post } from '../lib/types'

export type PostCounts = {
  total: number
  published: number
  draft: number
  byCategory: Record<string, number>
}

export function countPosts(posts: Post[], categories: Category[]): PostCounts {
  const byCategory: Record<string, number> = {}
  categories.forEach((c) => {
    byCategory[c.id] = 0
  })
  let published = 0
  posts.forEach((p) => {
    if (p.status === 'published') published += 1
    byCategory[p.categoryId] = (byCategory[p.categoryId] ?? 0) + 1
  })
  return {
    total: posts.length,
    published,
    draft: posts.length - published,
    byCategory,
  }
}

export function filterPosts(
  posts: Post[],
  statusFilter: 'all' | 'draft' | 'published',
  categoryFilter: string,
): Post[] {
  return posts.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false
    return true
  })
}

export function usePosts() {
  const { posts, categories, statusFilter, categoryFilter } = useApp()
  const counts = countPosts(posts, categories)
  const filtered = filterPosts(posts, statusFilter, categoryFilter)
  return { counts, filtered }
}

'use client'
import { useApp } from '../components/AppStateProvider'
import type { Article, Category, CategoryFilter } from '../lib/types'

const CATEGORIES: Category[] = ['account', 'billing', 'technical', 'general']

export function filterByCategory(articles: Article[], filter: CategoryFilter): Article[] {
  if (filter === 'all') return articles.slice()
  return articles.filter((a) => a.category === filter)
}

export function searchArticles(articles: Article[], query: string): Article[] {
  const needle = query.trim().toLowerCase()
  if (needle.length === 0) return []
  return articles.filter(
    (a) =>
      a.title.toLowerCase().indexOf(needle) !== -1 ||
      a.body.toLowerCase().indexOf(needle) !== -1,
  )
}

export function countByCategory(articles: Article[]): Record<Category, number> {
  const counts: Record<Category, number> = { account: 0, billing: 0, technical: 0, general: 0 }
  articles.forEach((a) => {
    counts[a.category] += 1
  })
  return counts
}

export function useArticles() {
  const { articles, categoryFilter, query } = useApp()
  const filtered = filterByCategory(articles, categoryFilter)
  const results = searchArticles(articles, query)
  const counts = countByCategory(articles)
  return { filtered, results, counts, categories: CATEGORIES }
}

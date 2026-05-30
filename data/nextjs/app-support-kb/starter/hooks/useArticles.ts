'use client'
import { useApp } from '../components/AppStateProvider'
import type { Article, Category, CategoryFilter } from '../lib/types'

const CATEGORIES: Category[] = ['account', 'billing', 'technical', 'general']

export function filterByCategory(_articles: Article[], _filter: CategoryFilter): Article[] {
  // TODO: return articles in the chosen category (or all)
  return []
}

export function searchArticles(_articles: Article[], _query: string): Article[] {
  // TODO: case-insensitive match over title/body; empty query => []
  return []
}

export function countByCategory(_articles: Article[]): Record<Category, number> {
  // TODO: count articles per category
  return { account: 0, billing: 0, technical: 0, general: 0 }
}

export function useArticles() {
  const { articles, categoryFilter, query } = useApp()
  void articles
  void categoryFilter
  void query
  return {
    filtered: [] as Article[],
    results: [] as Article[],
    counts: { account: 0, billing: 0, technical: 0, general: 0 } as Record<Category, number>,
    categories: CATEGORIES,
  }
}

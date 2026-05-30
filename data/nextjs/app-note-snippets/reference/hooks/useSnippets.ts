'use client'
import { useApp } from '../components/AppStateProvider'
import type { Snippet } from '../lib/types'

export function collectLanguages(snippets: Snippet[]): string[] {
  const set = new Set<string>()
  snippets.forEach((s) => set.add(s.language))
  return Array.from(set).sort()
}

export function filterSnippets(
  snippets: Snippet[],
  languageFilter: string | null,
  searchQuery: string,
): Snippet[] {
  const q = searchQuery.trim().toLowerCase()
  return snippets.filter((s) => {
    if (languageFilter && s.language !== languageFilter) return false
    if (q.length > 0 && !s.title.toLowerCase().includes(q)) return false
    return true
  })
}

export function useSnippets() {
  const { snippets, languageFilter, searchQuery, selectedId } = useApp()
  const visibleSnippets = filterSnippets(snippets, languageFilter, searchQuery)
  const languages = collectLanguages(snippets)
  const favorites = snippets.filter((s) => s.favorite)
  const selected = snippets.find((s) => s.id === selectedId) ?? null
  return { visibleSnippets, languages, favorites, selected }
}
